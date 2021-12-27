using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.PBI
{
    /// <summary>
    /// Handler for finishing PBI
    /// </summary>
    public class EstimatePBICommandHandler : IRequestHandler<EstimatePBICommand, BacklogItem>
    {
        private readonly ILogger<EstimatePBICommandHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;
        private readonly IMediator _mediator;

        /// <summary>
        /// Constructor
        /// </summary>
        public EstimatePBICommandHandler(ILogger<EstimatePBICommandHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext, IMediator mediator)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
            _mediator = mediator ?? throw new ArgumentException(null, nameof(mediator));
        }

        /// <inheritdoc/>
        public Task<BacklogItem> Handle(EstimatePBICommand request, CancellationToken cancellationToken)
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

            var pbi = _dbContext.BacklogItems?.FirstOrDefault(pbi => pbi.Id == request.PBIId) ?? null;

            if (pbi == null || pbi?.RepositoryId != dbRepository.Id)
                throw new NotFoundException("Backlog item not found in ScrumHub");

            pbi.ExpectedTimeInHours = request.EstimationInHours;

            _dbContext.Update(pbi);
            _dbContext.SaveChanges();

            return Task.FromResult(new BacklogItem(pbi.Id, request, _dbContext, _mediator));
        }
    }
}
