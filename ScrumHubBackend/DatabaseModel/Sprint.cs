using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScrumHubBackend.DatabaseModel
{
    /// <summary>
    /// Represents a sprint
    /// </summary>
    [Table("sprint")]
    public class Sprint
    {
        /// <summary>
        /// Internal id of sprint
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        /// <summary>
        /// Number of a sprint in the project
        /// </summary>
        [Required]
        public long SprintNumber { get; set; }

        /// <summary>
        /// Goal of the sprint
        /// </summary>
        public string Goal { get; set; } = String.Empty;

        /// <summary>
        /// Id of a repository where Sprint is
        /// </summary>
        public long? RepositoryId { get; set; } = null;

        /// <summary>
        /// Constructor
        /// </summary>
        public Sprint() { }

        /// <summary>
        /// Constructor
        /// </summary>
        public Sprint(long sprintNumber, string goal, long repositoryId)
        {
            SprintNumber = sprintNumber;
            Goal = goal;
            RepositoryId = repositoryId;
        }

        /// <summary>
        /// Gets PBIs for sprint
        /// </summary>
        public List<BacklogItem> GetPBIsForSprint(List<BacklogItem> pbisForRepository) => pbisForRepository.Where(pbi => pbi.SprintId == SprintNumber).ToList() ?? new List<BacklogItem>();
    }
}
