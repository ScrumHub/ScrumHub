using MediatR;
using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.PBI
{
    /// <summary>
    /// Command for finishing one PBI
    /// </summary>
    public class FinishPBICommand : IRequest<BacklogItem>
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
    }
}
