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

            var repoTasks = dbContext.Tasks?.Where(task => task.RepositoryId == dbRepo.Id).ToList() ?? new List<DatabaseModel.Task>();

            foreach(var repoTask in repoTasks)
            {
                if(repositoryIssues.Any(repIs => repIs.Id == repoTask.GitHubIssueId))
                    continue;
                // Remove task where issue no longer exists
                dbContext.Remove(repoTask);
            }

            foreach(var repoIssue in repositoryIssues)
            {
                if (repoTasks.Any(repoT => repoT.GitHubIssueId == repoIssue.Id))
                    continue;
                // Add task for issue
                var newTask = new DatabaseModel.Task(repoIssue, dbRepo, dbContext);
                dbContext.Add(newTask);
            }

            dbContext.SaveChanges();
        }
    }
}
