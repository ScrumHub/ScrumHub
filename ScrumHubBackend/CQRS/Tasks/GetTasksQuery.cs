using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Get all the tasks from repository
    /// </summary>
    public class GetTasksQuery : IRequest<PaginatedList<SHTask>>
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
        /// Page number
        /// </summary>
        public int PageNumber { get; set; }

        /// <summary>
        /// Page size
        /// </summary>
        public int PageSize { get; set; }
    }
}
