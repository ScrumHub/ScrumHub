using MediatR;
using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.People
{
    /// <summary>
    /// Query for getting person that is logged in
    /// </summary>
    public class GetCurrentPersonQuery : IRequest<Person>
    {
        /// <summary>
        /// Github authorization token
        /// </summary>
        public string? AuthToken { get; set; }
    }
}
