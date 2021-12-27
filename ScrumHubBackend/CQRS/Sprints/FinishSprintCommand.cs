using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.Sprints
{
    /// <summary>
    /// Command for finishing sprint
    /// </summary>
    public class FinishSprintCommand : CommonInRepositoryRequest<Sprint>
    {
        /// <summary>
        /// Number of the sprint
        /// </summary>
        public long SprintNumber { get; set; }

        /// <summary>
        /// True if sprint was failed, false if it was success
        /// </summary>
        public bool IsFailure { get; set; }
    }
}
