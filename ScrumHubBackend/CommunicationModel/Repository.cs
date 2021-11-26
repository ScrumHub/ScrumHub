namespace ScrumHubBackend.CommunicationModel
{
    /// <summary>
    /// Represents repository
    /// </summary>
    public class Repository
    {
        /// <summary>
        /// Name of repository
        /// </summary>
        public string? Name { get; set; } = String.Empty;

        /// <summary>
        /// Description of the repository
        /// </summary>
        public string? Description { get; set; } = String.Empty;

        /// <summary>
        /// GitHub id of repository
        /// </summary>
        public long GitHubId { get; set; } = 0;

        /// <summary>
        /// Does current user have admin rights to the repository
        /// </summary>
        public bool HasAdminRights { get; set; } = false;

        /// <summary>
        /// Is this repository already in ScrumHub
        /// </summary>
        public bool AlreadyInScrumHub { get; set; } = false;

        /// <summary>
        /// List of ids of backlog items
        /// </summary>
        public List<long> BacklogItems { get; set; } = new List<long>();

        /// <summary>
        /// List of numbers of sprints
        /// </summary>
        public List<long> Sprints { get; set; } = new List<long>();

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
            Description = repository.Description;
            GitHubId = repository.Id;
            HasAdminRights = repository.Permissions.Admin == true;
            DatabaseModel.Repository? dbRepository = 
                dbContext.Repositories?.FirstOrDefault(internalRepository => internalRepository.GitHubId == GitHubId);

            if (dbRepository == null)
            {
                AlreadyInScrumHub = false;
                return;
            }

            AlreadyInScrumHub = true;
            BacklogItems = dbContext.BacklogItems?.Where(pbi => pbi.RepositoryId == dbRepository.Id).Select(dbPbi => dbPbi.Id).ToList() ?? new List<long>();
            Sprints = dbContext.Sprints?.Where(sprint => sprint.RepositoryId == dbRepository.Id).Select(sprint => sprint.SprintNumber).ToList() ?? new List<long>();
        }
    }
}
