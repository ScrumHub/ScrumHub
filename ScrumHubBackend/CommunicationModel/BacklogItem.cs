namespace ScrumHubBackend.CommunicationModel
{
    /// <summary>
    /// Represents PBI 
    /// </summary>
    public class BacklogItem
    {
        /// <summary>
        /// Id of the PBI
        /// </summary>
        public long Id { get; set; } = 0;

        /// <summary>
        /// Name of the PBI
        /// </summary>
        public string Name { get; set; } = String.Empty;

        /// <summary>
        /// Flag if the PBI was finished
        /// </summary>
        public bool Finished { get; set; } = false;

        /// <summary>
        /// Estimation how many time will be spent on PBI
        /// </summary>
        public double ExpectedTimeInHours { get; set; } = 0;

        /// <summary>
        /// Is the PBI estimated
        /// </summary>
        public bool Estimated { get => ExpectedTimeInHours > 0; }

        /// <summary>
        /// Sprint where PBI is
        /// </summary>
        public long? SprintNumber { get; set; } = null;

        /// <summary>
        /// Is the PBI in sprint
        /// </summary>
        public bool IsInSprint { get => SprintNumber != null && SprintNumber > 0; }

        /// <summary>
        /// How many hours was spent on PBI
        /// </summary>
        public double TimeSpentInHours { get; set; } = 0;

        /// <summary>
        /// Priority of the PBI
        /// </summary>
        public long Priority { get; set; } = 0;

        /// <summary>
        /// List of acceptance criteria for the PBI
        /// </summary>
        public IList<string>? AcceptanceCriteria { get; set; } = new List<string>();

        /// <summary>
        /// Constructor
        /// </summary>
        public BacklogItem() { }

        /// <summary>
        /// Constructor
        /// </summary>
        public BacklogItem(long dbId, DatabaseContext dbContext) : this(dbContext.BacklogItems?.Find(dbId), dbContext)
        {
        }

        /// <summary>
        /// Constructor
        /// </summary>
        public BacklogItem(DatabaseModel.BacklogItem? dbPBI, DatabaseContext dbContext)
        {
            Id = dbPBI?.Id ?? 0;
            Name = dbPBI?.Name ?? String.Empty;
            Finished = dbPBI?.Finished ?? false;
            ExpectedTimeInHours = dbPBI?.ExpectedTimeInHours ?? 0;
            TimeSpentInHours = dbPBI?.TimeSpentInHours ?? 0;
            Priority = dbPBI?.Priority ?? 0;

            AcceptanceCriteria = dbPBI?.GetAcceptanceCriteriaForPBI(dbContext).Select(ac => ac.Text).ToList();

            SprintNumber = dbPBI?.SprintId ?? null;
        }
    }
}
