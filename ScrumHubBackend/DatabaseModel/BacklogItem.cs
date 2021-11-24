using ScrumHubBackend.CQRS.PBI;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScrumHubBackend.DatabaseModel
{
    /// <summary>
    /// Represents one backlog element
    /// </summary>
    [Table("backlog_item")]
    public class BacklogItem
    {
        /// <summary>
        /// Internal id of PBI
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        /// <summary>
        /// Name of the PBI
        /// </summary>
        [Required]
        public string Name { get; set; } = String.Empty;

        /// <summary>
        /// Id of the github label representing PBI
        /// </summary>
        [Required]
        public long GitHubLabelId { get; set; } = 0;
        
        /// <summary>
        /// Flag if the PBI was finished
        /// </summary>
        [Required]
        public bool Finished { get; set; } = false;

        /// <summary>
        /// Estimation how many time will be spent on PBI
        /// </summary>
        public double ExpectedTimeInHours { get; set; } = 0;

        /// <summary>
        /// How many hours was spent on PBI
        /// </summary>
        public double TimeSpentInHours { get; set; } = 0;

        /// <summary>
        /// Priority of the task
        /// </summary>
        public long Priority { get; set; } = 0;

        /// <summary>
        /// List of acceptance criterium for the PBI
        /// </summary>
        public ICollection<AcceptanceCriterium>? AcceptanceCriteria { get; set; } = null;

        /// <summary>
        /// List of tasks for this PBI
        /// </summary>
        public ICollection<Task>? Tasks { get; set; } = null;


        /// <summary>
        /// Constructor
        /// </summary>
        public BacklogItem() { }

        /// <summary>
        /// Creates backlog item from command
        /// </summary>
        public static BacklogItem CreateNewBacklogItem(AddPBICommand command)
        {
            BacklogItem backlogItem = new();
            backlogItem.Name = command.Name ?? String.Empty;
            backlogItem.Priority = command.Priority;
            backlogItem.AcceptanceCriteria = new List<AcceptanceCriterium>();

            foreach (var criterium in command.AcceptanceCriteria ?? new List<string>())
            {
                backlogItem.AcceptanceCriteria.Add(new AcceptanceCriterium(criterium));
            }

            return backlogItem;
        }
    }
}
