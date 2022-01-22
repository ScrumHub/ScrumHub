using Octokit;
using ScrumHubBackend.DatabaseModel;
using System.Text.RegularExpressions;

namespace ScrumHubBackend.GitHubClient
{

    /// <summary>
    /// Interface for resynchronizing group of objects between ScrumHub and remote repository
    /// </summary>
    public interface IGitHubResynchronization
    {
        /// <summary>
        /// Resynchronizes issued between GitHub and ScrumHub
        /// </summary>
        /// <exception cref="CustomExceptions.NotFoundException">Repository not found</exception>
        void ResynchronizeIssues(Octokit.Repository repo, IEnumerable<Issue> repositoryIssues, IGitHubClient gitHubClient, DatabaseContext dbContext);
    }

    /// <summary>
    /// Class for resynchronizing group of objects between ScrumHub and GitHub 
    /// </summary>
    public class GitHubResynchronization : IGitHubResynchronization
    {
        /// <inheritdoc/>
        public void ResynchronizeIssues(Octokit.Repository repository, IEnumerable<Issue> repositoryIssues, IGitHubClient gitHubClient, DatabaseContext dbContext)
        {
            var repositoryPRsRequest = new PullRequestRequest
            {
                State = ItemStateFilter.All
            };

            var repositoryPRsToDefaultBranch = 
                gitHubClient.PullRequest.GetAllForRepository(repository.Id, repositoryPRsRequest)
                    .Result.Where( pr => 
                        pr.Base.Ref == repository.DefaultBranch);
            var repositoryBranches = gitHubClient.Repository.Branch.GetAll(repository.Id).Result;

            var dbRepo = dbContext.Repositories?.FirstOrDefault(repo => repo.GitHubId == repository.Id);

            if (dbRepo == null)
                throw new CustomExceptions.NotFoundException("Repository not found");

            var scrumHubTasks = dbContext.Tasks?.Where(task => task.RepositoryId == dbRepo.Id).ToList() ?? new List<DatabaseModel.SHTask>();

            AddTasks(scrumHubTasks, repositoryIssues, dbRepo, dbContext);

            // After adding tasks the list requires to be refreshed
            scrumHubTasks = dbContext.Tasks?.Where(task => task.RepositoryId == dbRepo.Id).ToList() ?? new List<DatabaseModel.SHTask>();

            UpdateAndRemoveTasks(repository.Id, scrumHubTasks, repositoryIssues, repositoryPRsToDefaultBranch, repositoryBranches, dbContext, gitHubClient);

            // Next update after potentially removing tasks
            scrumHubTasks = dbContext.Tasks?.Where(task => task.RepositoryId == dbRepo.Id).ToList() ?? new List<DatabaseModel.SHTask>();

            SetTasksStatusDependingOnBranch(scrumHubTasks, repositoryIssues, repositoryBranches, dbContext);
        }

        private static void UpdateAndRemoveTasks(long repositoryId, IEnumerable<SHTask> scrumHubTasks, IEnumerable<Issue> repositoryIssues, IEnumerable<PullRequest> repositoryPRsToDefaultBranch, IEnumerable<Branch> repositoryBranches, DatabaseContext dbContext, IGitHubClient gitHubClient)
        {
            foreach (var scrumHubTask in scrumHubTasks)
            {
                
                var repositoryIssue = repositoryIssues.FirstOrDefault(repoIssue => repoIssue.Id == scrumHubTask.GitHubIssueId);

                // If issues in repository contain the task - we do 'update' part
                if (repositoryIssue != default)
                {
                    

                    // Transition to 'InProgress' if status is 'New' and proper branch exists
                    if(scrumHubTask.Status == Common.SHTaskStatus.New)
                    {
                        // Exists a branch with proper name that can be reated as a branch for this task
                        if(repositoryBranches.Any(branch => NameMatchesIssueBranchName(branch.Name, repositoryIssue.Number))) {
                            scrumHubTask.Status = Common.SHTaskStatus.InProgress;
                            dbContext.Update(scrumHubTask);
                        }
                    }

                    var relatedPRs = repositoryPRsToDefaultBranch.Where(pr => NameMatchesIssueBranchName(pr.Head.Ref, repositoryIssue.Number));

                    // Transition to 'In review' if there are any open PRs from this task branch to default
                    if (scrumHubTask.Status != Common.SHTaskStatus.Finished)
                    {
                        if(relatedPRs.Any(pr => pr.State.Value == ItemState.Open))
                        {
                            scrumHubTask.Status = Common.SHTaskStatus.InReview;
                            dbContext.Update(scrumHubTask);
                        }
                    }

                    // Closing the issue if we have permissions and finishing the task
                    if(scrumHubTask.Status != Common.SHTaskStatus.Finished)
                    {
                        if(relatedPRs.Any(pr => pr.Merged == true))
                        {
                            scrumHubTask.Status = Common.SHTaskStatus.Finished;
                            dbContext.Update(scrumHubTask);

                            var issueUpdate = new IssueUpdate()
                            {
                                State = ItemState.Closed
                            };

                            try
                            {
                                gitHubClient.Issue.Update(repositoryId, repositoryIssue.Number, issueUpdate).Wait();
                            } 
                            catch
                            {
                                // If we do not have permissions, well, happens - issue will be closed some other time
                            }
                        }
                    }

                    // Transition to 'Finished' on closed issue
                    if (repositoryIssue.State.Value == ItemState.Closed && scrumHubTask.Status != Common.SHTaskStatus.Finished)
                    {
                        scrumHubTask.Status = Common.SHTaskStatus.Finished;
                        dbContext.Update(scrumHubTask);
                    }
                }
                else // If not - we should delete it in ScrumHub
                {
                    dbContext.Remove(scrumHubTask);
                }    
            }

            dbContext.SaveChanges();
        }

        private static bool NameMatchesIssueBranchName(string name, long issueNumber) => Regex.IsMatch(name, $"^(.*)/{issueNumber}\\..*$", RegexOptions.IgnoreCase);

        private static void SetTasksStatusDependingOnBranch(IEnumerable<SHTask> tasks, IEnumerable<Issue> repositoryIssues, IEnumerable<Branch> repositoryBranches, DatabaseContext dbContext)
        {
            bool update = false;

            foreach (var task in tasks)
            {
                var repositoryIssue = repositoryIssues.FirstOrDefault(repoIssue => repoIssue.Id == task.GitHubIssueId);

                if (repositoryIssue == default)
                    continue;

                var branchExists = repositoryBranches.Any(branch => NameMatchesIssueBranchName(branch.Name, repositoryIssue.Number));

                if(task.Status == Common.SHTaskStatus.Finished && branchExists)
                {
                    task.Status = Common.SHTaskStatus.FinishedWBranch;
                    dbContext.Update(task);
                    update = true;
                } 
                else if(task.Status == Common.SHTaskStatus.FinishedWBranch && !branchExists)
                {
                    task.Status = Common.SHTaskStatus.Finished;
                    dbContext.Update(task);
                    update = true;
                }
                else if(task.Status == Common.SHTaskStatus.InReview && branchExists)
                {
                    task.Status = Common.SHTaskStatus.InReviewWBranch;
                    dbContext.Update(task);
                    update = true;
                }
                else if(task.Status == Common.SHTaskStatus.InReviewWBranch && !branchExists)
                {
                    task.Status = Common.SHTaskStatus.InReview;
                    dbContext.Update(task);
                    update = true;
                }
                else if(task.Status == Common.SHTaskStatus.InProgress && branchExists)
                {
                    task.Status = Common.SHTaskStatus.InProgressWBranch;
                    dbContext.Update(task);
                    update = true;
                }
                else if(task.Status == Common.SHTaskStatus.InProgressWBranch && !branchExists)
                {
                    task.Status = Common.SHTaskStatus.InProgress;
                    dbContext.Update(task);
                    update = true;
                }
                else if(task.Status == Common.SHTaskStatus.New && branchExists)
                {
                    task.Status = Common.SHTaskStatus.NewWBranch;
                    dbContext.Update(task);
                    update = true;
                }
                else if(task.Status == Common.SHTaskStatus.NewWBranch && !branchExists)
                {
                    task.Status = Common.SHTaskStatus.New;
                    dbContext.Update(task);
                    update = true;
                }
            }

            if (update)
                dbContext.SaveChanges();
        }

        private static void AddTasks(IEnumerable<SHTask> scrumHubTasks, IEnumerable<Issue> repositoryIssues, DatabaseModel.Repository dbRepo, DatabaseContext dbContext)
        {
            foreach (var repoIssue in repositoryIssues)
            {
                if (scrumHubTasks.Any(scrumHubTask => scrumHubTask.GitHubIssueId == repoIssue.Id))
                    continue;

                // Add task for issue
                var newTask = new SHTask(repoIssue, dbRepo, dbContext);
                dbContext.Add(newTask);
            }

            dbContext.SaveChanges();
        }
    }
}
