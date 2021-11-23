namespace ScrumHubBackend.CommunicationModel
{
    /// <summary>
    /// Represents PBI 
    /// </summary>
    public class BacklogItem
    {
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
        public ICollection<string>? AcceptanceCriteria { get; set; } = new List<string>();

        /// <summary>
        /// List of tasks for this PBI
        /// </summary>
        public ICollection<long>? Tasks { get; set; } = null;

        /// <summary>
        /// Constructor
        /// </summary>
        public BacklogItem() { }

        /// <summary>
        /// Constructor
        /// </summary>
        public BacklogItem(long dbId, DatabaseContext dbContext)
        {
            DatabaseModel.BacklogItem? dbPBI = dbContext.BacklogItems?.Find(dbId);
            Name = dbPBI?.Name ?? String.Empty;
            Finished = dbPBI?.Finished ?? false;
            ExpectedTimeInHours = dbPBI?.ExpectedTimeInHours ?? 0;
            TimeSpentInHours = dbPBI?.TimeSpentInHours ?? 0;
            Priority = dbPBI?.Priority ?? 0;

            AcceptanceCriteria = 
                dbPBI?.AcceptanceCriteria?.Select(crit => crit.Text).ToList() ?? new List<string>();
        }
    }
}
