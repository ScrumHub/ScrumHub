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
        /// <example>2</example>
        public int PageNumber { get; set; }

        /// <summary>
        /// Total number of pages
        /// </summary>
        /// <example>3</example>
        public int PageCount { get; set; }

        /// <summary>
        /// Size of page
        /// </summary>
        /// <example>10</example>
        public int PageSize { get; set; }

        /// <summary>
        /// Number of actually received elements
        /// </summary>
        /// <example>10</example>
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
