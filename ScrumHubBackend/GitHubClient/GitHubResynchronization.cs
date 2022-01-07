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
        void ResynchronizeIssues(Octokit.Repository repo, IGitHubClient gitHubClient, DatabaseContext dbContext);
    }

    /// <summary>
    /// Class for resynchronizing group of objects between ScrumHub and GitHub 
    /// </summary>
    public class GitHubResynchronization : IGitHubResynchronization
    {
        /// <inheritdoc/>
        public void ResynchronizeIssues(Octokit.Repository repository, IGitHubClient gitHubClient, DatabaseContext dbContext)
        {
            var repositoryIssueRequest = new RepositoryIssueRequest
            {
                State = ItemStateFilter.All
            };

            var issuesAndPullRequests = gitHubClient.Issue.GetAllForRepository(repository.Id, repositoryIssueRequest).Result;
            var repositoryIssues = issuesAndPullRequests.Where(iapr => iapr.PullRequest == null);
            var repositoryPRs = issuesAndPullRequests.Where(iapr => iapr.PullRequest != null);
            var repositoryBranches = gitHubClient.Repository.Branch.GetAll(repository.Id).Result;

            var dbRepo = dbContext.Repositories?.FirstOrDefault(repo => repo.GitHubId == repository.Id);

            if (dbRepo == null)
                throw new CustomExceptions.NotFoundException("Repository not found");

            var scrumHubTasks = dbContext.Tasks?.Where(task => task.RepositoryId == dbRepo.Id).ToList() ?? new List<DatabaseModel.SHTask>();

            AddTasks(scrumHubTasks, repositoryIssues, dbRepo, dbContext);

            // After adding tasks the list requires to be refreshed
            scrumHubTasks = dbContext.Tasks?.Where(task => task.RepositoryId == dbRepo.Id).ToList() ?? new List<DatabaseModel.SHTask>();

            UpdateAndRemoveTasks(scrumHubTasks, repositoryIssues, repositoryBranches, dbContext);
        }

        private static void UpdateAndRemoveTasks(IEnumerable<SHTask> scrumHubTasks, IEnumerable<Issue> repositoryIssues, IEnumerable<Branch> repositoryBranches, DatabaseContext dbContext)
        {
            foreach (var scrumHubTask in scrumHubTasks)
            {
                
                var repositoryIssue = repositoryIssues.FirstOrDefault(repoIssue => repoIssue.Id == scrumHubTask.GitHubIssueId);

                // If issues in repository contain the task - we do 'update' part
                if (repositoryIssue != default)
                {
                    // Transition to 'Finished' on closed issue
                    if(repositoryIssue.State.Value == ItemState.Closed && scrumHubTask.Status != Common.SHTaskStatus.Finished)
                    {
                        scrumHubTask.Status = Common.SHTaskStatus.Finished;
                        dbContext.Update(scrumHubTask);
                    }

                    // Transition to 'InProgress' if status is 'New' and proper branch exists
                    if(scrumHubTask.Status == Common.SHTaskStatus.New)
                    {
                        // Exists a branch with proper name that can be reated as a branch for this task
                        if(repositoryBranches.Any(branch => Regex.IsMatch(branch.Name, $"^(.*)/{repositoryIssue.Number}\\..*$", RegexOptions.IgnoreCase))) {
                            scrumHubTask.Status = Common.SHTaskStatus.InProgress;
                            dbContext.Update(scrumHubTask);
                        }
                    }
                }
                else // If not - we should delete it in ScrumHub
                {
                    dbContext.Remove(scrumHubTask);
                }    
            }

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
