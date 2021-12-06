using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Handler for assigning the task to a PBI
    /// </summary>
    public class AssignTaskToPBICommandHandler : IRequestHandler<AssignTaskToPBICommand, SHTask>
    {
        private readonly ILogger<AssignTaskToPBICommandHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;

        /// <summary>
        /// Constructor
        /// </summary>
        public AssignTaskToPBICommandHandler(ILogger<AssignTaskToPBICommandHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
        }

        /// <inheritdoc/>
        public Task<SHTask> Handle(AssignTaskToPBICommand request, CancellationToken cancellationToken)
        {
            if (request == null || request.AuthToken == null)
                throw new BadHttpRequestException("Missing token");

            var gitHubClient = _gitHubClientFactory.Create(request.AuthToken);

            var repository = gitHubClient.Repository.Get(request.RepositoryOwner, request.RepositoryName).Result;
            if (!repository.Permissions.Admin)
                throw new ForbiddenException("Not enough permissions to edit task in the repository");

            var dbRepository = _dbContext.Repositories?.FirstOrDefault(repo => repo.FullName == repository.FullName);

            if (dbRepository == null)
                throw new NotFoundException("Repository not found in ScrumHub");

            if (request.PBIId != 0 && !dbRepository.GetPBIsForRepository(_dbContext).Any(pbi => pbi.Id == request.PBIId))
                throw new NotFoundException("PBI not found");

            var repoTasks = dbRepository.GetTasksForRepository(_dbContext);

            var dbTask = repoTasks.FirstOrDefault(tsk => tsk.Id == request.TaskId);

            var issue = gitHubClient.Issue.Get(repository.Id, dbTask?.GitHubIssueNumberInRepo ?? 0).Result;

            if (dbTask == null || issue == null)
                throw new NotFoundException("Task not found");

            dbTask.PBI = request.PBIId;
            _dbContext.Update(dbTask);
            _dbContext.SaveChanges();

            return Task.FromResult(new SHTask(issue, _dbContext));
        }
    }
}
