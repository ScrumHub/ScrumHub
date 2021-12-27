using ScrumHubBackend.CommunicationModel.Common;

namespace ScrumHubBackend.CQRS
{
    /// <summary>
    /// Common part of all requests that are getting list and are executed inside repository
    /// </summary>
    public class CommonInRepositoryGetListQuery<T> : CommonInRepositoryRequest<PaginatedList<T>>
    {
        /// <summary>
        /// Page number
        /// </summary>
        public int PageNumber { get; set; }

        /// <summary>
        /// Page size
        /// </summary>
        public int PageSize { get; set; }

        /// <summary>
        /// True to get everything as one page
        /// </summary>
        public bool? OnePage { get; set; }
    }
}
