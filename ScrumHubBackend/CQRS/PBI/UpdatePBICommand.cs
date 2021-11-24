using MediatR;
using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.PBI
{
    /// <summary>
    /// Command for updating one PBI
    /// </summary>
    public class UpdatePBICommand : IRequest<BacklogItem>
    {
        /// <summary>
        /// Github authorization token
        /// </summary>
        public string? AuthToken { get; set; }

        /// <summary>
        /// Owner of the repository
        /// </summary>
        public string? RepositoryOwner { get; set; }

        /// <summary>
        /// Name of the repository
        /// </summary>
        public string? RepositoryName { get; set; }

        /// <summary>
        /// Id of the PBI
        /// </summary>
        public long PBIId { get; set; }

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
