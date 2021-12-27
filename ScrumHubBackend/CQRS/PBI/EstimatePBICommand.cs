using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.PBI
{
    /// <summary>
    /// Command for finishing one PBI
    /// </summary>
    public class EstimatePBICommand : CommonInRepositoryRequest<BacklogItem>
    {
        /// <summary>
        /// Id of the PBI
        /// </summary>
        public long PBIId { get; set; }

        /// <summary>
        /// Estimation in hours
        /// </summary>
        public long EstimationInHours { get; set; }
    }
}
