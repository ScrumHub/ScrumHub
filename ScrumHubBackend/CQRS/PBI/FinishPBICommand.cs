using MediatR;
using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.PBI
{
    /// <summary>
    /// Command for finishing one PBI
    /// </summary>
    public class FinishPBICommand : CommonInRepositoryRequest<BacklogItem>
    { 
        /// <summary>
        /// Id of the PBI
        /// </summary>
        public long PBIId { get; set; }
    }
}
