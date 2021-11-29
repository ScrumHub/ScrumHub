using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScrumHubBackend.DatabaseModel
{
    /// <summary>
    /// Represents one task that has elements in ScrumHub
    /// </summary>
    [Table("task")]
    public class Task
    {
        /// <summary>
        /// Internal id of task
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        /// <summary>
        /// Id of the github issue representing the task
        /// </summary>
        [Required]
        public int GitHubIssueId { get; set; } = 0;

        /// <summary>
        /// Id of the github issue representing the task
        /// </summary>
        [Required]
        public int GitHubIssueNumberInRepo { get; set; } = 0;

        /// <summary>
        /// Id of the repository
        /// </summary>
        [Required]
        public long RepositoryId { get; set; }

        /// <summary>
        /// Id of the PBI where the task is assigned
        /// </summary>
        public long? PBI { get; set; }
        
        /// <summary>
        /// Gests ScrumHub task from issue, null if not found
        /// </summary>
        public static Task? GetTaskFromIssue(Octokit.Issue issue, DatabaseContext dbContext)
        {
            var dbTask = dbContext.Tasks?.FirstOrDefault(task => task.GitHubIssueId == issue.Id);
            return dbTask;
        }

        /// <summary>
        /// Checks if issue is already in ScrumHub
        /// </summary>
        public static bool IsIsueInScrumHub(Octokit.Issue issue, DatabaseContext dbContext) => GetTaskFromIssue(issue, dbContext) != null;

        /// <summary>
        /// Constructor
        /// </summary>
        public Task() { }

        /// <summary>
        /// Constructor, throws exceptions
        /// </summary>
        /// <exception cref="CustomExceptions.ConflictException">Issue is already in ScrumHub</exception>
        /// <exception cref="CustomExceptions.NotFoundException">Pbi does not exist in the repository</exception>
        /// <exception cref="CustomExceptions.NotFoundException">Issue does not belong to the repository</exception>
        public Task(Octokit.Issue issue, Repository repository, DatabaseContext dbContext, long? pbiAssignedToTheTask = null)
        {
            if (IsIsueInScrumHub(issue, dbContext))
                throw new CustomExceptions.ConflictException("Issue already in ScrumHub");

            if (pbiAssignedToTheTask != null &&
                pbiAssignedToTheTask > 0 &&
                !repository.GetPBIsForRepository(dbContext).Any(pbi => pbi.Id == pbiAssignedToTheTask))
                throw new CustomExceptions.NotFoundException("Pbi does not exist");

            GitHubIssueId = issue.Id;
            GitHubIssueNumberInRepo = issue.Number;
            RepositoryId = repository.Id;
            PBI = pbiAssignedToTheTask;
        }
    }
}
