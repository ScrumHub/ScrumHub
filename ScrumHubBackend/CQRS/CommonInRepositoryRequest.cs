using MediatR;

namespace ScrumHubBackend.CQRS
{
    /// <summary>
    /// Interface for common part of the request
    /// </summary>
    public interface ICommonInRepositoryRequest
    {
        /// <summary>
        /// Github authorization token
        /// </summary>
        string? AuthToken { get; set; }

        /// <summary>
        /// Owner of the repository
        /// </summary>
        string? RepositoryOwner { get; set; }

        /// <summary>
        /// Name of the repository
        /// </summary>
        string? RepositoryName { get; set; }
    }

    /// <summary>
    /// Common part of all requests that are executed inside repository
    /// </summary>
    public abstract class CommonInRepositoryRequest<T> : IRequest<T>, ICommonInRepositoryRequest
    {
        /// <inheritdoc/>
        public string? AuthToken { get; set; }

        /// <inheritdoc/>
        public string? RepositoryOwner { get; set; }

        /// <inheritdoc/>
        public string? RepositoryName { get; set; }
    }
}
