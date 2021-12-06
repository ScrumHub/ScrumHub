using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;

namespace ScrumHubBackend.CQRS.Repositories
{
    /// <summary>
    /// Query for getting all repositories of an user
    /// </summary>
    public class GetRepositoriesQuery : IRequest<PaginatedList<Repository>>
    {
        /// <summary>
        /// Github authorization token
        /// </summary>
        public string? AuthToken { get; set; }

        /// <summary>
        /// Page number
        /// </summary>
        public int PageNumber { get; set; }

        /// <summary>
        /// Page size
        /// </summary>
        public int PageSize { get; set; }

        /// <summary>
        /// Filter for name of type "Contains"
        /// </summary>
        public string? NameFilter { get; set; }

    }
}
