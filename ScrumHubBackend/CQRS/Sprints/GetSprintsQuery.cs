using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.Sprints
{
    /// <summary>
    /// Query getting list of sprints
    /// </summary>
    public class GetSprintsQuery : CommonInRepositoryGetListQuery<Sprint>
    {
        /// <summary>
        /// Filter for completed sprints
        /// </summary>
        public bool? CompletedFilter { get; set; }
    }
}
