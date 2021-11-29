using MediatR;
using ScrumHubBackend.CommunicationModel.Common;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Query for getting tasks for one PBI
    /// </summary>
    public class GetTasksForPBIQuery : IRequest<PaginatedList<CommunicationModel.Task>>
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
        /// Id of the PBI, 0 for unassigned
        /// </summary>
        public long PBIId { get; set; } 
    }
}
