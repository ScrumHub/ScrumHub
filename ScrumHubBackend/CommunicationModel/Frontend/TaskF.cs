namespace ScrumHubBackend.CommunicationModel.Frontend
{
    /// <summary>
    /// Represents information about new task from frontend
    /// </summary>
    public class TaskF
    {
        /// <summary>
        /// Name of the new task
        /// </summary>
        /// <example>Fix buttons colour</example>
        public string Name { get; set; } = String.Empty;

        /// <summary>
        /// Id of PBI the task belongs to, 0 for unassigned
        /// </summary>
        /// <example>9</example>
        public long PBIId { get; set; }
    }
}
