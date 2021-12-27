using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;

namespace ScrumHubBackend.CQRS.Sprints
{
    /// <summary>
    /// Query getting list of sprints
    /// </summary>
    public class GetSprintsQuery : CommonInRepositoryRequest<PaginatedList<Sprint>>
    {
        /// <summary>
        /// Page number
        /// </summary>
        public int PageNumber { get; set; }

        /// <summary>
        /// Page size
        /// </summary>
        public int PageSize { get; set; }
    }
}
