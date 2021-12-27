using MediatR;
using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Query for getting one task
    /// </summary>
    public class GetOneTaskQuery : CommonInRepositoryRequest<SHTask>
    {
        /// <summary>
        /// Id of the task
        /// </summary>
        public long TaskId { get; set; }
    }
}
