using MediatR;
using SrumHubBackend.GitHubClient;
using SrumHubBackend.CommunicationModel;
using Microsoft.EntityFrameworkCore;

namespace SrumHubBackend.CQRS.Repositories
{
    /// <summary>
    /// Handler getting all repositories for an user
    /// </summary>
    public class GetRepositoriesQueryHandler : IRequestHandler<GetRepositoriesQuery, IEnumerable<Repository>>
    {
        private readonly ILogger<GetRepositoriesQueryHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;

        /// <summary>
        /// Constructor
        /// </summary>
        public GetRepositoriesQueryHandler(ILogger<GetRepositoriesQueryHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
        }

        /// <inheritdoc/>
        public Task<IEnumerable<Repository>> Handle(GetRepositoriesQuery request, CancellationToken cancellationToken)
        {
            if (request == null || request.AuthToken == null)
                throw new Exception("Missing token");

            var gitHubClient = _gitHubClientFactory.Create(request.AuthToken);

            var user = gitHubClient.User.Current().Result;

            var repositories = GetRepositoriesForCurrentUser(gitHubClient).Result;

            _logger.LogInformation("Found {} repos for user {}", repositories.Count, user.Login);

            var returnedRepos = repositories.Select(repository 
                => new Repository(repository, _dbContext));

            return Task.FromResult(returnedRepos);
        }

        /// <summary>
        /// Gets repositories of user that is logged in
        /// </summary>
        protected virtual Task< IReadOnlyList<Octokit.Repository> > GetRepositoriesForCurrentUser(Octokit.GitHubClient client) 
            => client.Repository.GetAllForCurrent();

    }
}
