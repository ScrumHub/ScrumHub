using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Handler for assigining and unassigning 
    /// </summary>
    public class ChangePersonInTaskCommandHandler : IRequestHandler<ChangePersonInTaskCommand, SHTask>
    {
        private readonly ILogger<ChangePersonInTaskCommandHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;

        /// <summary>
        /// Constructor
        /// </summary>
        public ChangePersonInTaskCommandHandler(ILogger<ChangePersonInTaskCommandHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
        }

        /// <inheritdoc/>
        public Task<SHTask> Handle(ChangePersonInTaskCommand request, CancellationToken cancellationToken)
        {
            if (request == null || request.AuthToken == null)
                throw new BadHttpRequestException("Missing token");

            var gitHubClient = _gitHubClientFactory.Create(request.AuthToken);

            // If it does not exists then user does not have permissions to read id
            var repository = gitHubClient.Repository.Get(request.RepositoryOwner, request.RepositoryName).Result;

            var dbRepository = _dbContext.Repositories?.FirstOrDefault(repo => repo.FullName == repository.FullName);

            if (dbRepository == null)
                throw new NotFoundException("Repository not found in ScrumHub");

            if (!repository.Permissions.Admin)
                throw new ForbiddenException("Not enough permissions to add task to the repository");

            var dbTask = dbRepository.GetTasksForRepository(_dbContext)?.FirstOrDefault(tsk => tsk.Id == request.TaskId);

            if (dbTask == null)
                throw new NotFoundException("Task not found");

            var issue = gitHubClient.Issue.Get(repository.Id, dbTask.GitHubIssueNumberInRepo).Result;

            if (issue == null)
                throw new NotFoundException("Task not found");

            var update = new Octokit.AssigneesUpdate(new List<string>() { request.PersonLogin });

            if (request.AssignPerson)
                issue = gitHubClient.Issue.Assignee.AddAssignees(repository.Owner.Login, repository.Name, issue.Number, update).Result;
            else
                issue = gitHubClient.Issue.Assignee.RemoveAssignees(repository.Owner.Login, repository.Name, issue.Number, update).Result;

            return Task.FromResult(new SHTask(issue, _dbContext));
        }
    }
}
