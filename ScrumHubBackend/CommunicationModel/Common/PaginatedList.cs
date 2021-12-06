namespace ScrumHubBackend.CommunicationModel.Common
{
    /// <summary>
    /// List of elements with pagination data
    /// </summary>
    public class PaginatedList<T>
    {
        /// <summary>
        /// Number of actual page
        /// </summary>
        public int PageNumber { get; set; }

        /// <summary>
        /// Total number of pages
        /// </summary>
        public int PageCount { get; set; }

        /// <summary>
        /// Size of page
        /// </summary>
        public int PageSize { get; set; }

        /// <summary>
        /// Number of actually received elements
        /// </summary>
        public int RealSize { get; set; }

        /// <summary>
        /// Actual list of items
        /// </summary>
        public IEnumerable<T> List { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        public PaginatedList(IEnumerable<T> list, int pageNumber, int pageSize, int pageCount)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;
            PageCount = pageCount;
            List = list ?? throw new ArgumentNullException(nameof(list));
            RealSize = list.Count();
        }
    }
}
