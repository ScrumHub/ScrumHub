namespace ScrumHubBackend.CommunicationModel
{
    /// <summary>
    /// Represents a sprint
    /// </summary>
    public class Sprint
    {
        /// <summary>
        /// Number of a sprint in the project
        /// </summary>
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
        public Sprint(DatabaseModel.Sprint dbSprint, DatabaseContext dbContext)
        {
            SprintNumber = dbSprint.SprintNumber;
            Goal = dbSprint.Goal;
            var relatedBacklogItem = dbContext.BacklogItems?.Where(pbi => pbi.SprintId == dbSprint.Id).Select(pbi => new BacklogItem(pbi, dbContext));
            BacklogItems = relatedBacklogItem?.ToList() ?? new List<BacklogItem>();
        }
    }
}
