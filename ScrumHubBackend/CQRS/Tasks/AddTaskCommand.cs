using MediatR;
using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Command for adding new task
    /// </summary>
    public class AddTaskCommand : IRequest<SHTask>
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
        /// Name of new task
        /// </summary>
        public string Name { get; set; } = String.Empty;

        /// <summary>
        /// Id of the PBI, 0 for unassigned
        /// </summary>
        public long PBIId { get; set; }
    }
}
