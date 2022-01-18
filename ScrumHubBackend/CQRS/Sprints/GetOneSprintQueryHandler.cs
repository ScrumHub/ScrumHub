using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.Sprints
{
    /// <summary>
    /// Handler for getting one sprint
    /// </summary>
    public class GetOneSprintQueryHandler : IRequestHandler<GetOneSprintQuery, Sprint>
    {
        private readonly ILogger<GetOneSprintQueryHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;
        private readonly IMediator _mediator;

        /// <summary>
        /// Constructor
        /// </summary>
        public GetOneSprintQueryHandler(ILogger<GetOneSprintQueryHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext, IMediator mediator)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
            _mediator = mediator ?? throw new ArgumentException(null, nameof(mediator));
        }

        /// <inheritdoc/>
        public Task<Sprint> Handle(GetOneSprintQuery request, CancellationToken cancellationToken)
        {
            if (request == null || request.AuthToken == null)
                throw new BadHttpRequestException("Missing token");

            var gitHubClient = _gitHubClientFactory.Create(request.AuthToken);

            // If it does not exists then user does not have permissions to read id
            var repository = gitHubClient.Repository.Get(request.RepositoryOwner, request.RepositoryName).Result;

            var dbRepository = _dbContext.Repositories?.FirstOrDefault(repo => repo.FullName == repository.FullName);

            if (dbRepository == null)
                throw new NotFoundException("Repository not found in ScrumHub");

            var sprintsForRepository = dbRepository.GetSprintsForRepository(_dbContext);
            var dbSprint = sprintsForRepository?.FirstOrDefault(sprint => sprint.SprintNumber == request.SprintNumber) ?? null;

            if(dbSprint == null)
                throw new NotFoundException("Sprint not fount in the repository");

            return Task.FromResult(new Sprint(dbSprint, gitHubClient, repository, dbRepository, request, _dbContext, _mediator, true));
        }
    }
}
