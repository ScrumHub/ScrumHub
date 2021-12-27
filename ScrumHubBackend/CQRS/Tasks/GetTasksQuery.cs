using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Get all the tasks from repository
    /// </summary>
    public class GetTasksQuery : CommonInRepositoryRequest<PaginatedList<SHTask>>
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
