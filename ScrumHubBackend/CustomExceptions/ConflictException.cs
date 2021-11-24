namespace ScrumHubBackend.CustomExceptions
{
    /// <summary>
    /// Represents conflict
    /// </summary>
    public class ConflictException : Exception
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public ConflictException(string message) : base(message) { }
    }
}
