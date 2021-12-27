using MediatR;
using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.Sprints
{
    /// <summary>
    /// Command adding sprint to ScrumHub
    /// </summary>
    public class AddSprintCommand : CommonInRepositoryRequest<Sprint>
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
        /// Finish date of the sprint
        /// </summary>
        public DateTime FinishDate { get; set; }

        /// <summary>
        /// Title of the sprint
        /// </summary>
        public string? Title { get; set; }
    }
}
