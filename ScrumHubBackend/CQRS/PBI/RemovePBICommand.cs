using MediatR;

namespace ScrumHubBackend.CQRS.PBI
{
    /// <summary>
    /// Command for removing one PBI
    /// </summary>
    public class RemovePBICommand : CommonInRepositoryRequest<Unit>
    {
        /// <summary>
        /// Id of the PBI
        /// </summary>
        public long PBIId { get; set; }
    }
}
