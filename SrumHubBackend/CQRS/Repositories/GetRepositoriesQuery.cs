using MediatR;
using SrumHubBackend.CommunicationModel;

namespace SrumHubBackend.CQRS.Repositories
{
    /// <summary>
    /// Query for getting all repositories of an user
    /// </summary>
    public class GetRepositoriesQuery : IRequest<IEnumerable<Repository>>
    {
        /// <summary>
        /// Github authorization token
        /// </summary>
        public string? AuthToken { get; set; }

    }
}
