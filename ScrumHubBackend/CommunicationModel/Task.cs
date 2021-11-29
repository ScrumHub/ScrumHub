namespace ScrumHubBackend.CommunicationModel
{
    /// <summary>
    /// Represents a task
    /// </summary>
    public class Task
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
        /// PBI where the task is assigned
        /// </summary>
        public long? PBIId { get; set; } = null;

        /// <summary>
        /// Is the task in PBI
        /// </summary>
        public bool IsAssignedToPBI { get => PBIId != null && PBIId > 0; }

        /// <summary>
        /// Constructor
        /// </summary>
        public Task() { }

        /// <summary>
        /// Constructor, can throw exception
        /// </summary>
        /// <exception cref="CustomExceptions.NotFoundException">Issue not found in ScrumHub</exception>
        public Task(Octokit.Issue issue, DatabaseContext dbContext)
        {
            var dbTask = DatabaseModel.Task.GetTaskFromIssue(issue, dbContext);

            if (dbTask == null)
                throw new CustomExceptions.NotFoundException("Issue not found in ScrumHub");

            Id = dbTask.Id;
            Name = issue.Title;
            Finished = issue.State.Value == Octokit.ItemState.Closed;
            PBIId = dbTask.PBI;
        }
    }
}
