namespace ScrumHubBackend.CustomExceptions
{
    /// <summary>
    /// Represents Not Found
    /// </summary>
    public class NotFoundException : Exception
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public NotFoundException(string message) : base(message) { }
    }
}
