using MediatR;
using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.PBI
{
    /// <summary>
    /// Gets one PBI
    /// </summary>
    public class GetOnePBIQuery : CommonInRepositoryRequest<BacklogItem>
    {
        /// <summary>
        /// Id of the PBI
        /// </summary>
        public long PBIId { get; set; }
    }
}
