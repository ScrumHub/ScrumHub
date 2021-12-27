using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Query for getting tasks for one PBI
    /// </summary>
    public class GetTasksForPBIQuery : CommonInRepositoryGetListQuery<SHTask>
    {
        /// <summary>
        /// Id of the PBI, 0 for unassigned
        /// </summary>
        public long PBIId { get; set; } 
    }
}
