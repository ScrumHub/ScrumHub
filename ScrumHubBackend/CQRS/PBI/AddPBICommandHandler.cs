using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.PBI
{
    /// <summary>
    /// Handler for adding the PBI to repository
    /// </summary>
    public class AddPBICommandHandler : IRequestHandler<AddPBICommand, BacklogItem>
    {
        private readonly ILogger<AddPBICommandHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;
        private readonly IMediator _mediator;

        /// <summary>
        /// Constructor
        /// </summary>
        public AddPBICommandHandler(ILogger<AddPBICommandHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext, IMediator mediator)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
            _mediator = mediator ?? throw new ArgumentException(null, nameof(mediator));
        }

        /// <inheritdoc/>
        public Task<BacklogItem> Handle(AddPBICommand request, CancellationToken cancellationToken)
        {
            if (request == null || request.AuthToken == null)
                throw new BadHttpRequestException("Missing token");

            var gitHubClient = _gitHubClientFactory.Create(request.AuthToken);

            var repository = gitHubClient.Repository.Get(request.RepositoryOwner, request.RepositoryName).Result;

            var dbRepository = _dbContext.Repositories?.FirstOrDefault(repo => repo.FullName == repository.FullName);

            if (dbRepository == null)
                throw new NotFoundException("Repository not found in ScrumHub");

            if (!repository.Permissions.Admin)
                throw new ForbiddenException("Not enough permissions to add PBI to repository");

            var newPBI = new DatabaseModel.BacklogItem(request, dbRepository.Id);

            _dbContext.Add(newPBI);
            _dbContext.SaveChanges();

            newPBI.UpdateAcceptanceCriteria(request.AcceptanceCriteria ?? new List<string>(), _dbContext);

            return Task.FromResult(new BacklogItem(newPBI.Id, request, _dbContext, _mediator, true));
        }
    }
}
