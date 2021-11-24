namespace ScrumHubBackend.CommunicationModel.Frontend
{
    /// <summary>
    /// Represents PBI information from frontend 
    /// </summary>
    public class BacklogItemF
    {
        /// <summary>
        /// Name of the PBI
        /// </summary>
        public string Name { get; set; } = String.Empty;

        /// <summary>
        /// Priority of the PBI
        /// </summary>
        public long Priority { get; set; } = 0;

        /// <summary>
        /// List of acceptance criteria for the PBI
        /// </summary>
        public List<string> AcceptanceCriteria { get; set; } = new List<string>();
    }
}
