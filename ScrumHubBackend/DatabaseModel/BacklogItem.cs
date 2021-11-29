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
        /// List of tasks for this PBI
        /// </summary>
        public ICollection<SHTask>? Tasks { get; set; } = null;

        /// <summary>
        /// Id of a sprint where PBI is
        /// </summary>
        public long? SprintId { get; set; } = null;

        /// <summary>
        /// Id of a repository where PBI is
        /// </summary>
        public long? RepositoryId { get; set; } = null;


        /// <summary>
        /// Constructor
        /// </summary>
        public BacklogItem() { }

        /// <summary>
        /// Constructor, not adding acceptance criteria
        /// </summary>
        public BacklogItem(AddPBICommand command, long repositoryId) 
        {
            Name = command.Name ?? String.Empty;
            Priority = command.Priority;
            RepositoryId = repositoryId;
        }

        /// <summary>
        /// Adds or updates acceptance criteria for PBI saving changes in DB
        /// </summary>
        public void UpdateAcceptanceCriteria(List<String> newCriteria, DatabaseContext dbContext)
        {
            var oldCriteria = GetAcceptanceCriteriaForRepository(dbContext);
            foreach(var oldCriterium in oldCriteria)
            {
                dbContext.Remove(oldCriterium);
            }

            foreach(var newCriterium in newCriteria)
            {
                var criterium = new AcceptanceCriterium(newCriterium, Id);
                dbContext.Add(criterium);
            }

            dbContext.SaveChanges();
        }

        /// <summary>
        /// Gets acceptance criteria for PBI
        /// </summary>
        public List<AcceptanceCriterium> GetAcceptanceCriteriaForRepository(DatabaseContext dbContext) => dbContext.AcceptanceCriteria?.Where(ac => ac.BacklogItemId == Id).ToList() ?? new List<AcceptanceCriterium>();
    }
}
