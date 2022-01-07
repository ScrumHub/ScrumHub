using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Handler for getting tasks for the PBI
    /// </summary>
    public class GetTasksForPBIQueryHandler : IRequestHandler<GetTasksForPBIQuery, PaginatedList<SHTask>>
    {
        private readonly ILogger<GetTasksForPBIQueryHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly IGitHubResynchronization _gitHubResynchronization;
        private readonly DatabaseContext _dbContext;

        /// <summary>
        /// Constructor
        /// </summary>
        public GetTasksForPBIQueryHandler(ILogger<GetTasksForPBIQueryHandler> logger, IGitHubClientFactory clientFactory, IGitHubResynchronization gitHubResynchronization, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
            _gitHubResynchronization = gitHubResynchronization ?? throw new ArgumentException(null, nameof(gitHubResynchronization));
        }

        /// <inheritdoc/>
        public Task<PaginatedList<SHTask>> Handle(GetTasksForPBIQuery request, CancellationToken cancellationToken)
        {
            if (request == null || request.AuthToken == null)
                throw new BadHttpRequestException("Missing token");

            var gitHubClient = _gitHubClientFactory.Create(request.AuthToken);

            // If it does not exists then user does not have permissions to read id
            var repository = gitHubClient.Repository.Get(request.RepositoryOwner, request.RepositoryName).Result;

            var dbRepository = _dbContext.Repositories?.FirstOrDefault(repo => repo.FullName == repository.FullName);

            if (dbRepository == null)
                throw new NotFoundException("Repository not found in ScrumHub");

            if (request.PBIId != 0 && !dbRepository.GetPBIsForRepository(_dbContext).Any(pbi => pbi.Id == request.PBIId))
                throw new NotFoundException("PBI not found");

            var repositoryIssueRequest = new Octokit.RepositoryIssueRequest
            {
                State = Octokit.ItemStateFilter.All
            };

            var issuesAndPullRequests = gitHubClient.Issue.GetAllForRepository(repository.Id, repositoryIssueRequest).Result;
            if (issuesAndPullRequests == null)
                throw new NotFoundException("Issues not found");

            var issues = issuesAndPullRequests.Where(iss => iss.PullRequest == null);

            _gitHubResynchronization.ResynchronizeIssues(repository, gitHubClient, _dbContext);

            var repoTasks = dbRepository.GetTasksForRepository(_dbContext);

            var filteredTasks = repoTasks.Where(rt => request.PBIId <= 0 ? (rt.PBI == null || rt.PBI <= 0) : (rt.PBI != null && rt.PBI == request.PBIId));
            var filteredIssues = filteredTasks.Select(rt => issues.FirstOrDefault(iss => iss.Id == rt.GitHubIssueId) ?? null);
            var notNullIssues = filteredIssues.Where(iss => iss != null).Select(iss => iss!);

            var transformedTasks = notNullIssues.Select(rt => new SHTask(rt, _dbContext));

            return Task.FromResult(new PaginatedList<CommunicationModel.SHTask>(transformedTasks ?? new List<CommunicationModel.SHTask>(), 1, transformedTasks?.Count() ?? 0, 1));
        }
    }
}
