using MediatR;

namespace ScrumHubBackend.CQRS
{
    /// <summary>
    /// Common part of all requests that are executed inside repository
    /// </summary>
    public abstract class CommonInRepositoryRequest<T> : IRequest<T>
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
    }
}
