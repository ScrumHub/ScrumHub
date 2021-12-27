using MediatR;
using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Command for assigning and unassigning person from task
    /// </summary>
    public class ChangePersonInTaskCommand : CommonInRepositoryRequest<SHTask>
    {
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
