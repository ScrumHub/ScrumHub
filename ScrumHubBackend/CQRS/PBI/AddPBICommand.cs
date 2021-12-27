using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.PBI
{
    /// <summary>
    /// Command adding PBI to ScrumHub
    /// </summary>
    public class AddPBICommand : CommonInRepositoryRequest<BacklogItem>
    {
        /// <summary>
        /// Name of the PBI
        /// </summary>
        public string? Name { get; set; }

        /// <summary>
        /// Acceptance criteria of PBI
        /// </summary>
        public List<string>? AcceptanceCriteria { get; set; }

        /// <summary>
        /// Priority of PBI
        /// </summary>
        public long Priority { get; set; } = 0;
    }
}
