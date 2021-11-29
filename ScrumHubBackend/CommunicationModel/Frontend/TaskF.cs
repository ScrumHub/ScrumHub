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
        public string Name { get; set; } = String.Empty;

        /// <summary>
        /// Id of PBI the task belongs to, 0 for unassigned
        /// </summary>
        public long PBIId { get; set; }
    }
}
