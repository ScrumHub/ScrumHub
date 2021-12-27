using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.Sprints
{
    /// <summary>
    /// Command updating one sprint
    /// </summary>
    public class UpdateSprintCommand : CommonInRepositoryRequest<Sprint>
    {
        /// <summary>
        /// Goal of the sprint
        /// </summary>
        public string? Goal { get; set; }

        /// <summary>
        /// Ids of PBIs in the sprint
        /// </summary>
        public List<long>? PBIs { get; set; }

        /// <summary>
        /// Number of the sprint
        /// </summary>
        public long Number { get; set; } = 1;

        /// <summary>
        /// Finish date of the sprint
        /// </summary>
        public DateTime FinishDate { get; set; }

        /// <summary>
        /// Title of the sprint
        /// </summary>
        public string? Title { get; set; }
    }
}
