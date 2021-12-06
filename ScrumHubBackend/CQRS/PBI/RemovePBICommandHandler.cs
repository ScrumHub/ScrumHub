using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.PBI
{
    /// <summary>
    /// Handler for removal of PBI
    /// </summary>
    public class RemovePBICommandHandler : IRequestHandler<RemovePBICommand, Unit>
    {
        private readonly ILogger<RemovePBICommandHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;

        /// <summary>
        /// Constructor
        /// </summary>
        public RemovePBICommandHandler(ILogger<RemovePBICommandHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
        }

        /// <inheritdoc/>
        public Task<Unit> Handle(RemovePBICommand request, CancellationToken cancellationToken)
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

            // Unasign tasks
            var pbiTasks = dbRepository.GetTasksForRepository(_dbContext).Where(dbTask => dbTask.PBI == pbi.Id);
            foreach(var task in pbiTasks)
            {
                task.PBI = null;
                _dbContext.Update(task);
            }

            _dbContext.Remove(pbi);
            _dbContext.SaveChanges();

            return Unit.Task;
        }
    }
}
