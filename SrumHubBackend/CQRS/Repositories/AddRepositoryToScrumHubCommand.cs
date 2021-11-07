using MediatR;
using SrumHubBackend.CommunicationModel;

namespace SrumHubBackend.CQRS.Repositories
{
    /// <summary>
    /// Command adding repository to ScrumHub
    /// </summary>
    public class AddRepositoryToScrumHubCommand : IRequest<Repository>
    {
        /// <summary>
        /// Github authorization token
        /// </summary>
        public string? AuthToken { get; set; }

        /// <summary>
        /// Id of repository
        /// </summary>
        public long RepositoryId { get; set; }
    }
}
