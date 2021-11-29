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
        void ResynchronizeIssues(Octokit.Repository repo, DatabaseContext dbContext);
    }

    /// <summary>
    /// Class for resynchronizing group of objects between ScrumHub and GitHub 
    /// </summary>
    public class GitHubResynchronization : IGitHubResynchronization
    {
        /// <inheritdoc/>
        public void ResynchronizeIssues(Octokit.Repository repository, DatabaseContext dbContext)
        {
            var dbRepo = dbContext.Repositories?.FirstOrDefault(repo => repo.GitHubId == repository.Id);

            if (dbRepo == null)
                throw new CustomExceptions.NotFoundException("Repository not found");
        }
    }
}
