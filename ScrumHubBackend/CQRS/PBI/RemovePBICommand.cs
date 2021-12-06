using MediatR;

namespace ScrumHubBackend.CQRS.PBI
{
    /// <summary>
    /// Command for removing one PBI
    /// </summary>
    public class RemovePBICommand : IRequest<Unit>
    {
        /// <summary>
        /// Github authorization token
        /// </summary>
        public string? AuthToken { get; set; }

        /// <summary>
        /// Owner of the repository
        /// </summary>
        public string? RepositoryOwner { get; set; }

        /// <summary>
        /// Name of the repository
        /// </summary>
        public string? RepositoryName { get; set; }

        /// <summary>
        /// Id of the PBI
        /// </summary>
        public long PBIId { get; set; }
    }
}
