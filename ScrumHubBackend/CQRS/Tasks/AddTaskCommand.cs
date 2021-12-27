using MediatR;
using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Command for adding new task
    /// </summary>
    public class AddTaskCommand : CommonInRepositoryRequest<SHTask>
    {
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
