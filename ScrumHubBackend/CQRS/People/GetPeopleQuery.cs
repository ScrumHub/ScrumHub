using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.People
{
    /// <summary>
    /// Get list of all people for the repository
    /// </summary>
    public class GetPeopleQuery : CommonInRepositoryGetListQuery<Person>
    {
    }
}
