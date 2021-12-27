using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;

namespace ScrumHubBackend.CQRS.PBI
{
    /// <summary>
    /// Query for getting all PBIs from repository
    /// </summary>
    public class GetPBIsQuery : CommonInRepositoryRequest<PaginatedList<BacklogItem>>
    {
        /// <summary>
        /// Page number
        /// </summary>
        public int PageNumber { get; set; }

        /// <summary>
        /// Page size
        /// </summary>
        public int PageSize { get; set; }

        /// <summary>
        /// Filter for name of type "Contains"
        /// </summary>
        public string? NameFilter { get; set; }
        
        /// <summary>
        /// Filter if only finisehd PBIs should be taken, null for no filtering
        /// </summary>
        public bool? FinishedFilter { get; set; } = false;

        /// <summary>
        /// Filter if only estimated PBIs should be taken, null for no filtering
        /// </summary>
        public bool? EstimatedFilter { get; set; } = false;

        /// <summary>
        /// Filter if only PBIs assigned to a sprint should be taken, null for no filtering
        /// </summary>
        public bool? InSprintFilter { get; set; } = false;
    }
}
