using ScrumHubBackend.DatabaseModel;

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
        void ResynchronizeIssues(Octokit.Repository repo, IEnumerable<Octokit.Issue> repositoryIssues, DatabaseContext dbContext);
    }

    /// <summary>
    /// Class for resynchronizing group of objects between ScrumHub and GitHub 
    /// </summary>
    public class GitHubResynchronization : IGitHubResynchronization
    {
        /// <inheritdoc/>
        public void ResynchronizeIssues(Octokit.Repository repository, IEnumerable<Octokit.Issue> repositoryIssues, DatabaseContext dbContext)
        {
            var dbRepo = dbContext.Repositories?.FirstOrDefault(repo => repo.GitHubId == repository.Id);

            if (dbRepo == null)
                throw new CustomExceptions.NotFoundException("Repository not found");

            var scrumHubTasks = dbContext.Tasks?.Where(task => task.RepositoryId == dbRepo.Id).ToList() ?? new List<DatabaseModel.SHTask>();

            RemoveAndCloseTasks(scrumHubTasks, repositoryIssues, dbContext);

            AddTasks(scrumHubTasks, repositoryIssues, dbRepo, dbContext);

            dbContext.SaveChanges();
        }

        private static void RemoveAndCloseTasks(IEnumerable<SHTask> scrumHubTasks, IEnumerable<Octokit.Issue> repositoryIssues, DatabaseContext dbContext)
        {
            foreach (var scrumHubTask in scrumHubTasks)
            {
                
                var repositoryIssue = repositoryIssues.FirstOrDefault(repoIssue => repoIssue.Id == scrumHubTask.GitHubIssueId);

                // If issues in reository contain actual task we check if we should close it
                if (repositoryIssue != default)
                {
                    if(repositoryIssue.State.Value == Octokit.ItemState.Closed && scrumHubTask.Status != Common.SHTaskStatus.Finished)
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
        }

        private static void AddTasks(IEnumerable<SHTask> scrumHubTasks, IEnumerable<Octokit.Issue> repositoryIssues, Repository dbRepo, DatabaseContext dbContext)
        {
            foreach (var repoIssue in repositoryIssues)
            {
                if (scrumHubTasks.Any(scrumHubTask => scrumHubTask.GitHubIssueId == repoIssue.Id))
                    continue;

                // Add task for issue
                var newTask = new SHTask(repoIssue, dbRepo, dbContext);
                dbContext.Add(newTask);
            }
        }
    }
}
