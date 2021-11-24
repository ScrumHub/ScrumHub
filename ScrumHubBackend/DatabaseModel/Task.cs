using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScrumHubBackend.DatabaseModel
{
    /// <summary>
    /// Represents one task
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
        /// Name of the task
        /// </summary>
        [Required]
        public string Name { get; set; } = String.Empty;

        /// <summary>
        /// Flag if the task was finished
        /// </summary>
        [Required]
        public bool Finished { get; set; } = false;

        /// <summary>
        /// How many hours was spent on PBI
        /// </summary>
        public double TimeSpentInHours { get; set; } = 0;

        /// <summary>
        /// When the task was started
        /// </summary>
        public DateTime? StartTime { get; set; } = null;

        /// <summary>
        /// When the task was finished
        /// </summary>
        public DateTime? EndTime { get; set;} = null;

        /// <summary>
        /// List of asigned people
        /// </summary>
        public ICollection<AssignedPerson>? Assignees { get; set; } = null;

        /// <summary>
        /// Id of the github issue representing the task
        /// </summary>
        [Required]
        public int GitHubIssueId { get; set; } = 0;
    }
}
