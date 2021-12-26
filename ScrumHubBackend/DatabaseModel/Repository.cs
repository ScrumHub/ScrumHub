using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScrumHubBackend.DatabaseModel
{
    /// <summary>
    /// Represents repository already transformed to ScrumHub
    /// </summary>
    [Table("repository")]
    public class Repository
    {
        /// <summary>
        /// Internal id of repository
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        /// <summary>
        /// GitHub id of repository
        /// </summary>
        [Required]
        public long GitHubId { get; set; } = 0;

        /// <summary>
        /// Full name of GitHub repository
        /// </summary>
        [Required]
        public string FullName { get; set; } = String.Empty;

        /// <summary>
        /// Last Sprint number
        /// </summary>
        public int LastSprintNumber { get; set; } = 0;

        /// <summary>
        /// Constructor
        /// </summary>
        public Repository() { }

        /// <summary>
        /// Constructor
        /// </summary>
        public Repository(Octokit.Repository repository)
        {
            GitHubId = repository.Id;
            FullName = repository.FullName;
        }

        /// <summary>
        /// Gets sprints for repository
        /// </summary>
        public List<Sprint> GetSprintsForRepository(DatabaseContext dbContext) => dbContext.Sprints?.Where(sprint => sprint.RepositoryId == Id).ToList() ?? new List<Sprint>();

        /// <summary>
        /// Gets PBIs for repository
        /// </summary>
        public List<BacklogItem> GetPBIsForRepository(DatabaseContext dbContext) => dbContext.BacklogItems?.Where(pbi => pbi.RepositoryId == Id).ToList() ?? new List<BacklogItem>();

        /// <summary>
        /// Gets tasks for repository
        /// </summary>
        public List<SHTask> GetTasksForRepository(DatabaseContext dbContext) => dbContext.Tasks?.Where(task => task.RepositoryId == Id).ToList() ?? new List<SHTask>();
    }
}
