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
        /// <example>Add planning poker</example>
        public string Name { get; set; } = String.Empty;

        /// <summary>
        /// Priority of the PBI
        /// </summary>
        /// <example>2</example>
        public long Priority { get; set; } = 0;

        /// <summary>
        /// List of acceptance criteria for the PBI
        /// </summary>
        /// <example>[ "I can play plannig poker", "Result of the game is saved as an estimate" ]</example>
        public List<string> AcceptanceCriteria { get; set; } = new List<string>();
    }
}
