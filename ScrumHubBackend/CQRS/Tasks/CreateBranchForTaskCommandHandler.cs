using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;
using System.Text.RegularExpressions;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Handler for creating branches
    /// </summary>
    public class CreateBranchForTaskCommandHandler : IRequestHandler<CreateBranchForTaskCommand, SHTask>
    {
        private readonly ILogger<CreateBranchForTaskCommandHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;
        private readonly IGitHubResynchronization _gitHubResynchronization;

        /// <summary>
        /// Constructor
        /// </summary>
        public CreateBranchForTaskCommandHandler(ILogger<CreateBranchForTaskCommandHandler> logger, IGitHubClientFactory clientFactory, IGitHubResynchronization gitHubResynchronization, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
            _gitHubResynchronization = gitHubResynchronization ?? throw new ArgumentException(null, nameof(gitHubResynchronization));
        }

        /// <inheritdoc/>
        public Task<SHTask> Handle(CreateBranchForTaskCommand request, CancellationToken cancellationToken)
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

            if (!repository.Permissions.Admin)
                throw new ForbiddenException("Not enough permissions to add task to the repository");

            var dbTask = dbRepository.GetTasksForRepository(_dbContext)?.FirstOrDefault(tsk => tsk.Id == request.TaskId);

            if (dbTask == null)
                throw new NotFoundException("Task not found");

            var issue = gitHubClient.Issue.Get(repository.Id, dbTask.GitHubIssueNumberInRepo).Result;

            if (issue == null)
                throw new NotFoundException("Task not found");

            if (dbTask.Status != Common.SHTaskStatus.New)
                throw new ConflictException("Task was already started");

            string inbranchIssueName = Regex.Replace(issue.Title.Trim().ToLowerInvariant(), @"\s+", "-");
            string newBranchName = $"{request.BranchPrefix}/{issue.Number}.{inbranchIssueName}";

            var defaultBranch = gitHubClient.Repository.Branch.Get(repository.Id, repository.DefaultBranch).Result;

            // Create branch from master
            Octokit.NewReference newBranch = new Octokit.NewReference($"refs/heads/{newBranchName}", defaultBranch.Commit.Sha);
            gitHubClient.Git.Reference.Create(repository.Id, newBranch);

            dbTask.Status = Common.SHTaskStatus.InProgress;
            _dbContext.Update(dbTask);
            _dbContext.SaveChanges();

            return Task.FromResult(new SHTask(issue, _dbContext));
        } 
    }
}
