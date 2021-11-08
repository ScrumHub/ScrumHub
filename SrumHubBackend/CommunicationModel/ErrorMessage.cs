using System.Text.Json;

namespace ScrumHubBackend.CommunicationModel
{
    /// <summary>
    /// Class representing error message
    /// </summary>
    public class ErrorMessage
    {
        /// <summary>
        /// Message content
        /// </summary>
        public string? Message { get; set; }
        /// <summary>
        /// Error code
        /// </summary>
        public int Code { get; set; }

        /// <summary>
        /// Returns json from class instance
        /// </summary>
        public override string ToString() => JsonSerializer.Serialize(this);
    }
}
