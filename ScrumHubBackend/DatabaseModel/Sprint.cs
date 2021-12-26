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
        /// Title of the sprint
        /// </summary>
        public string Title { get; set; } = String.Empty;

        /// <summary>
        /// Goal of the sprint
        /// </summary>
        public string Goal { get; set; } = String.Empty;

        /// <summary>
        /// Id of a repository where Sprint is
        /// </summary>
        public long? RepositoryId { get; set; } = null;

        /// <summary>
        /// Date of the sprint finish
        /// </summary>
        public DateTime FinishDate { get; set; } = DateTime.MinValue;

        /// <summary>
        /// Constructor
        /// </summary>
        public Sprint() { }

        /// <summary>
        /// Constructor
        /// </summary>
        public Sprint(string goal, string title, DateTime finishDate, long repositoryId, DatabaseContext dbContext)
        {
            Title = title;
            FinishDate = finishDate;
            Goal = goal;
            RepositoryId = repositoryId;

            var dbRepository = dbContext.Find<Repository>(repositoryId);
            dbRepository.LastSprintNumber += 1;
            SprintNumber = dbRepository.LastSprintNumber;
            dbContext.Update(dbRepository);
            dbContext.SaveChanges();
        }

        /// <summary>
        /// Gets PBIs for sprint
        /// </summary>
        public List<BacklogItem> GetPBIsForSprint(List<BacklogItem> pbisForRepository) => pbisForRepository.Where(pbi => pbi.SprintId == SprintNumber).ToList() ?? new List<BacklogItem>();
    }
}
