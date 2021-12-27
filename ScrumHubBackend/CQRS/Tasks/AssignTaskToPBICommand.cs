using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Command for asssigning the task to the PBI
    /// </summary>
    public class AssignTaskToPBICommand : CommonInRepositoryRequest<SHTask>
    {
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
