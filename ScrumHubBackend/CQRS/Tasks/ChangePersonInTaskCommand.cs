using MediatR;
using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Command for assigning and unassigning person from task
    /// </summary>
    public class ChangePersonInTaskCommand : IRequest<SHTask>
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
        /// Login of the person
        /// </summary>
        public string PersonLogin { get; set; } = String.Empty;

        /// <summary>
        /// True to assign person, false to unassign
        /// </summary>
        public bool AssignPerson { get; set; }
    }
}
