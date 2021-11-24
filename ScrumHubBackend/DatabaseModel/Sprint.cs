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
        /// PBI that will be done in this sprint
        /// </summary>
        public ICollection<BacklogItem>? BacklogItems { get; set; } = null;

        /// <summary>
        /// Constructor
        /// </summary>
        public Sprint() { }

        /// <summary>
        /// Constructor
        /// </summary>
        public Sprint(long sprintNumber, string goal)
        {
            SprintNumber = sprintNumber;
            Goal = goal;
        }
    }
}
