using MediatR;
using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.Sprints
{
    /// <summary>
    /// Query getting one Sprint
    /// </summary>
    public class GetOneSprintQuery : IRequest<Sprint>
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
        /// Number of the sprint
        /// </summary>
        public long SprintNumber { get; set; }
    }
}
