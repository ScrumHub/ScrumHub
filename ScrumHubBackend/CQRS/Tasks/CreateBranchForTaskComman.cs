using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Command for creating branch for the task
    /// </summary>
    public class CreateBranchForTaskCommand : CommonInRepositoryRequest<SHTask>
    {
        /// <summary>
        /// Id of the task
        /// </summary>
        public long TaskId { get; set; }

        /// <summary>
        /// Prefix for the branch "{prefix}/{issue number}.{issue name}"
        /// </summary>
        public string BranchPrefix { get; set; } = "feature";
    }
}
