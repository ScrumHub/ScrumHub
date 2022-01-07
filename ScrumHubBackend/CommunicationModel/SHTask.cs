using ScrumHubBackend.Common;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CommunicationModel
{
    /// <summary>
    /// Represents a task
    /// </summary>
    public class SHTask
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
        /// Status of the task
        /// </summary>
        public SHTaskStatus Status { get; set; } = SHTaskStatus.New;

        /// <summary>
        /// Flag if the PBI was finished
        /// </summary>
        public bool Finished { get => Status == SHTaskStatus.Finished; }

        /// <summary>
        /// PBI where the task is assigned
        /// </summary>
        public long? PBIId { get; set; } = null;

        /// <summary>
        /// Is the task in PBI
        /// </summary>
        public bool IsAssignedToPBI { get => PBIId != null && PBIId > 0; }

        /// <summary>
        /// Link to the repository
        /// </summary>
        public string Link { get; set; } = String.Empty;

        /// <summary>
        /// People assigned to the task, "IsCurrentUser" is always false
        /// </summary>
        public IEnumerable<Person> Assigness { get; set; } = new List<Person>();

        /// <summary>
        /// Constructor
        /// </summary>
        public SHTask() { }

        /// <summary>
        /// Constructor, can throw exception
        /// </summary>
        /// <exception cref="CustomExceptions.NotFoundException">Issue not found in ScrumHub</exception>
        public SHTask(Octokit.Issue issue, DatabaseContext dbContext)
        {
            var dbTask = DatabaseModel.SHTask.GetTaskFromIssue(issue, dbContext);

            if (dbTask == null)
                throw new CustomExceptions.NotFoundException("Issue not found in ScrumHub");

            Id = dbTask.Id;
            Name = issue.Title;
            Status = dbTask.Status;
            PBIId = dbTask.PBI;
            Link = issue.HtmlUrl;

            Assigness = issue.Assignees.Select(assignee => new Person(assignee, -1));
        }
    }
}
