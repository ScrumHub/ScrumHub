using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Handler for getting one task
    /// </summary>
    public class GetOneTaskQueryHandler : IRequestHandler<GetOneTaskQuery, SHTask>
    {
        private readonly ILogger<GetOneTaskQueryHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;
        private readonly IGitHubResynchronization _gitHubResynchronization;

        /// <summary>
        /// Constructor
        /// </summary>
        public GetOneTaskQueryHandler(ILogger<GetOneTaskQueryHandler> logger, IGitHubClientFactory clientFactory, IGitHubResynchronization gitHubResynchronization, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
            _gitHubResynchronization = gitHubResynchronization ?? throw new ArgumentException(null, nameof(gitHubResynchronization));
        }

        /// <inheritdoc/>
        public Task<SHTask> Handle(GetOneTaskQuery request, CancellationToken cancellationToken)
        {
            if (request == null || request.AuthToken == null)
                throw new BadHttpRequestException("Missing token");

            var gitHubClient = _gitHubClientFactory.Create(request.AuthToken);

            // If it does not exists then user does not have permissions to read id
            var repository = gitHubClient.Repository.Get(request.RepositoryOwner, request.RepositoryName).Result;

            var dbRepository = _dbContext.Repositories?.FirstOrDefault(repo => repo.FullName == repository.FullName);

            if (dbRepository == null)
                throw new NotFoundException("Repository not found in ScrumHub");

            var dbTask = dbRepository.GetTasksForRepository(_dbContext)?.FirstOrDefault(tsk => tsk.Id == request.TaskId);

            if (dbTask == null)
                throw new NotFoundException("Task not found");

            var issue = gitHubClient.Issue.Get(repository.Id, dbTask.GitHubIssueNumberInRepo).Result;

            if (issue == null)
                throw new NotFoundException("Task not found");

            return Task.FromResult(new SHTask(issue, _dbContext));
        }
    }
}
