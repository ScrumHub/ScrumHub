using System.Text.Json;

namespace ScrumHubBackend.CommunicationModel.Common
{
    /// <summary>
    /// Class representing error message
    /// </summary>
    public class ErrorMessage
    {
        /// <summary>
        /// Message content
        /// </summary>
        /// <example>Something went wrong!</example>
        public string? Message { get; set; }
        /// <summary>
        /// Error code
        /// </summary>
        /// <example>500</example>
        public int Code { get; set; }

        /// <summary>
        /// Returns json from class instance
        /// </summary>
        public override string ToString() => JsonSerializer.Serialize(this);
    }
}
