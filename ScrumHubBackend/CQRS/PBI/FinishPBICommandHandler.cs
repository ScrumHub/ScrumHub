using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.PBI
{
    /// <summary>
    /// Handler for finishing PBI
    /// </summary>
    public class FinishPBICommandHandler : IRequestHandler<FinishPBICommand, BacklogItem>
    {
        private readonly ILogger<FinishPBICommandHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;

        /// <summary>
        /// Constructor
        /// </summary>
        public FinishPBICommandHandler(ILogger<FinishPBICommandHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
        }

        /// <inheritdoc/>
        public Task<BacklogItem> Handle(FinishPBICommand request, CancellationToken cancellationToken)
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

            if(pbi == null || pbi?.RepositoryId != dbRepository.Id)
                throw new NotFoundException("Backlog item not found in ScrumHub");

            pbi.Finished = true;

            _dbContext.Update(pbi);
            _dbContext.SaveChanges();

            return System.Threading.Tasks.Task.FromResult(new BacklogItem(pbi.Id, _dbContext));
        }
    }
}
