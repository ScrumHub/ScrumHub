using MediatR;
using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.Sprints
{
    /// <summary>
    /// Query getting one Sprint
    /// </summary>
    public class GetOneSprintQuery : CommonInRepositoryRequest<Sprint>
    {
        /// <summary>
        /// Number of the sprint
        /// </summary>
        public long SprintNumber { get; set; }
    }
}
