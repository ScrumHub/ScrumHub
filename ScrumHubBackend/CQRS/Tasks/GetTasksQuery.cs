using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Get all the tasks from repository
    /// </summary>
    public class GetTasksQuery : CommonInRepositoryGetListQuery<SHTask>
    {
    }
}
