using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Add new task command handler
    /// </summary>
    public class AddTaskCommandHandler : IRequestHandler<AddTaskCommand, SHTask>
    {
        private readonly ILogger<AddTaskCommandHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;

        /// <summary>
        /// Constructor
        /// </summary>
        public AddTaskCommandHandler(ILogger<AddTaskCommandHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
        }

        /// <inheritdoc/>
        public Task<SHTask> Handle(AddTaskCommand request, CancellationToken cancellationToken)
        {
            if (request == null || request.AuthToken == null)
                throw new BadHttpRequestException("Missing token");

            var gitHubClient = _gitHubClientFactory.Create(request.AuthToken);

            var repository = gitHubClient.Repository.Get(request.RepositoryOwner, request.RepositoryName).Result;

            if (!repository.Permissions.Admin)
                throw new ForbiddenException("Not enough permissions to add task to the repository");

            var dbRepository = _dbContext.Repositories?.FirstOrDefault(repo => repo.FullName == repository.FullName);

            if (dbRepository == null)
                throw new NotFoundException("Repository not found in ScrumHub");

            if (request.PBIId != 0 && !dbRepository.GetPBIsForRepository(_dbContext).Any(pbi => pbi.Id == request.PBIId))
                throw new NotFoundException("PBI not found");

            var newIssueInfo = new Octokit.NewIssue(request.Name)
            {
                Body = "This issue was generated automatically in ScrumHub"
            };

            var newIssue = gitHubClient.Issue.Create(repository.Id, newIssueInfo).Result;

            var dbTask = new DatabaseModel.SHTask(newIssue, dbRepository, _dbContext, request.PBIId)
            {
                PBI = request.PBIId
            };

            _dbContext.Add(dbTask);
            _dbContext.SaveChanges();

            return Task.FromResult(new SHTask(newIssue, _dbContext));
        }
    }
}
