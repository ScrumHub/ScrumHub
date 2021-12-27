using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.Sprints
{
    /// <summary>
    /// Handler for finishing sprint
    /// </summary>
    public class FinishSprintCommandHandler : IRequestHandler<FinishSprintCommand, Sprint>
    {
        private readonly ILogger<FinishSprintCommandHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;
        private readonly IMediator _mediator;

        /// <summary>
        /// Constructor
        /// </summary>
        public FinishSprintCommandHandler(ILogger<FinishSprintCommandHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext, IMediator mediator)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
            _mediator = mediator ?? throw new ArgumentException(null, nameof(mediator));
        }

        /// <inheritdoc/>
        public Task<Sprint> Handle(FinishSprintCommand request, CancellationToken cancellationToken)
        {
            if (request == null || request.AuthToken == null)
                throw new BadHttpRequestException("Missing token");

            var gitHubClient = _gitHubClientFactory.Create(request.AuthToken);

            var repository = gitHubClient.Repository.Get(request.RepositoryOwner, request.RepositoryName).Result;

            var dbRepository = _dbContext.Repositories?.FirstOrDefault(repo => repo.FullName == repository.FullName);

            if (dbRepository == null)
                throw new NotFoundException("Repository not found in ScrumHub");

            if (!repository.Permissions.Admin)
                throw new ForbiddenException("Not enough permissions to finish a PBI to repository");

            var sprintsForRepository = dbRepository.GetSprintsForRepository(_dbContext);
            var dbSprint = sprintsForRepository?.FirstOrDefault(sprint => sprint.SprintNumber == request.SprintNumber) ?? null;

            if (dbSprint == null)
                throw new NotFoundException("Sprint not fount in the repository");

            if (dbSprint.Status != Common.SprintStatus.NotFinished)
                throw new ConflictException("Sprint already finished");

            dbSprint.Status = request.IsFailure ? Common.SprintStatus.Failed : Common.SprintStatus.Successful;

            _dbContext.Update(dbSprint);
            _dbContext.SaveChanges();

            return Task.FromResult(new Sprint(dbSprint, request, _dbContext, _mediator));
        }
    }
}
