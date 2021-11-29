using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.PBI
{
    /// <summary>
    /// Handler for getting one PBI
    /// </summary>
    public class GetOnePBIQueryHandler : IRequestHandler<GetOnePBIQuery, BacklogItem>
    {
        private readonly ILogger<GetOnePBIQueryHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;

        /// <summary>
        /// Constructor
        /// </summary>
        public GetOnePBIQueryHandler(ILogger<GetOnePBIQueryHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
        }

        /// <inheritdoc/>
        public Task<BacklogItem> Handle(GetOnePBIQuery request, CancellationToken cancellationToken)
        {
            if (request == null || request.AuthToken == null)
                throw new BadHttpRequestException("Missing token");

            var gitHubClient = _gitHubClientFactory.Create(request.AuthToken);

            // If it does not exists then user does not have permissions to read id
            var repository = gitHubClient.Repository.Get(request.RepositoryOwner, request.RepositoryName).Result;

            var dbRepository = _dbContext.Repositories?.FirstOrDefault(repo => repo.FullName == repository.FullName);

            if (dbRepository == null)
                throw new NotFoundException("Repository not found in ScrumHub");

            var pbi = _dbContext.BacklogItems?.FirstOrDefault(pbi => pbi.Id == request.PBIId) ?? null;

            if (pbi == null || pbi?.RepositoryId != dbRepository.Id)
                throw new NotFoundException("Backlog item not found in ScrumHub");

            return System.Threading.Tasks.Task.FromResult(new BacklogItem(pbi.Id, _dbContext));
        }
    }
}
