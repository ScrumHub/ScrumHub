using MediatR;
using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Query for getting one task
    /// </summary>
    public class GetOneTaskQuery : IRequest<SHTask>
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
    }
}
