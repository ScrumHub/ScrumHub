using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Handler for getting tasks
    /// </summary>
    public class GetTasksQueryHandler : IRequestHandler<GetTasksQuery, PaginatedList<SHTask>>
    {
        private readonly ILogger<GetTasksQueryHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly IGitHubResynchronization _gitHubResynchronization;
        private readonly DatabaseContext _dbContext;

        /// <summary>
        /// Constructor
        /// </summary>
        public GetTasksQueryHandler(ILogger<GetTasksQueryHandler> logger, IGitHubClientFactory clientFactory, IGitHubResynchronization gitHubResynchronization, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
            _gitHubResynchronization = gitHubResynchronization ?? throw new ArgumentException(null, nameof(gitHubResynchronization));
        }

        /// <inheritdoc/>
        public Task<PaginatedList<SHTask>> Handle(GetTasksQuery request, CancellationToken cancellationToken)
        {
            if (request == null || request.AuthToken == null)
                throw new BadHttpRequestException("Missing token");

            var gitHubClient = _gitHubClientFactory.Create(request.AuthToken);

            // If it does not exists then user does not have permissions to read id
            var repository = gitHubClient.Repository.Get(request.RepositoryOwner, request.RepositoryName).Result;

            var dbRepository = _dbContext.Repositories?.FirstOrDefault(repo => repo.FullName == repository.FullName);

            if (dbRepository == null)
                throw new NotFoundException("Repository not found in ScrumHub");

            var repositoryIssueRequest = new Octokit.RepositoryIssueRequest
            {
                State = Octokit.ItemStateFilter.All
            };

            var issuesAndPullRequests = gitHubClient.Issue.GetAllForRepository(repository.Id, repositoryIssueRequest).Result;
            if (issuesAndPullRequests == null)
                throw new NotFoundException("Issues not found");

            var issues = issuesAndPullRequests.Where(iss => iss.PullRequest == null);

            _gitHubResynchronization.ResynchronizeIssues(repository, issues, _dbContext);

            return Task.FromResult(PaginateTasks(issues ?? new List<Octokit.Issue>(), request.PageNumber, request.PageSize));
        }

        /// <summary>
        /// Paginates sprints and transforms them to model repositories
        /// </summary>
        public virtual PaginatedList<SHTask> PaginateTasks(IEnumerable<Octokit.Issue> issues, int pageNumber, int pageSize)
        {
            var sortedIssues = issues.OrderByDescending(iss => iss.UpdatedAt);
            int startIndex = pageSize * (pageNumber - 1);
            int endIndex = Math.Min(startIndex + pageSize, sortedIssues.Count());
            var paginatedIssues = sortedIssues.Take(new Range(startIndex, endIndex));
            var transformedIssues = paginatedIssues.Select(iss => new SHTask(iss, _dbContext));

            int pagesCount = (int)Math.Ceiling(sortedIssues.Count() / (double)pageSize);
            return new PaginatedList<SHTask>(transformedIssues, pageNumber, pageSize, pagesCount);
        }
    }
}
