using MediatR;
using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Command for asssigning the task to the PBI
    /// </summary>
    public class AssignTaskToPBICommand : IRequest<SHTask>
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
        /// Id of the task
        /// </summary>
        public long TaskId { get; set; }

        /// <summary>
        /// Id of the PBI, 0 for unassigned
        /// </summary>
        public long PBIId { get; set; }
    }
}
