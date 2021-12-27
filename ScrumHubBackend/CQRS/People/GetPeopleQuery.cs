using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;

namespace ScrumHubBackend.CQRS.People
{
    /// <summary>
    /// Get list of all people for the repository
    /// </summary>
    public class GetPeopleQuery : CommonInRepositoryRequest<PaginatedList<Person>>
    {
    }
}
