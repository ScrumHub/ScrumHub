namespace ScrumHubBackend.CustomExceptions
{
    /// <summary>
    /// Represents forbidden
    /// </summary>
    public class ForbiddenException : Exception
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public ForbiddenException(string message) : base(message) { }
    }
}
