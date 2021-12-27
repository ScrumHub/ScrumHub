using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;

namespace ScrumHubBackend.CQRS.Sprints
{
    /// <summary>
    /// Query getting list of sprints
    /// </summary>
    public class GetSprintsQuery : CommonInRepositoryGetListQuery<Sprint>
    {
    }
}
