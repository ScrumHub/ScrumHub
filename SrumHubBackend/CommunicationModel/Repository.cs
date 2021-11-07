namespace SrumHubBackend.CommunicationModel
{
    /// <summary>
    /// Represents repository
    /// </summary>
    public class Repository
    {
        /// <summary>
        /// Name of repository
        /// </summary>
        public string? Name { get; set; }

        /// <summary>
        /// GitHub id of repository
        /// </summary>
        public long GitHubId { get; set; }

        /// <summary>
        /// Does current user have admin rights to the repository
        /// </summary>
        public bool HasAdminRights { get; set; }

        /// <summary>
        /// Is this repository already in ScrumHub
        /// </summary>
        public bool AlreadyInScrumHub { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        public Repository() { }

        /// <summary>
        /// Constructor
        /// </summary>
        public Repository(Octokit.Repository repository, DatabaseContext dbContext)
        {
            Name = repository.FullName;
            GitHubId = repository.Id;
            HasAdminRights = repository.Permissions.Admin == true;
            AlreadyInScrumHub = dbContext.Repositories?.Any(internalRepository => internalRepository.GitHubId == GitHubId) ?? false;
        }
    }
}
