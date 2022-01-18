using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Handler for filling PBIs with tasks
    /// </summary>
    public class FillPBIsWithTasksCommandHandler : IRequestHandler<FillPBIsWithTasksCommand, Dictionary<long, IEnumerable<SHTask>>>
    {
        private readonly ILogger<FillPBIsWithTasksCommandHandler> _logger;
        private readonly IGitHubResynchronization _gitHubResynchronization;
        private readonly DatabaseContext _dbContext;

        /// <summary>
        /// Constructor
        /// </summary>
        public FillPBIsWithTasksCommandHandler(ILogger<FillPBIsWithTasksCommandHandler> logger, IGitHubResynchronization gitHubResynchronization, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubResynchronization = gitHubResynchronization ?? throw new ArgumentException(null, nameof(gitHubResynchronization));
        }

        /// <inheritdoc/>
        public Task<Dictionary<long, IEnumerable<SHTask>>> Handle(FillPBIsWithTasksCommand request, CancellationToken cancellationToken)
        {
            if (request.BacklogItems == null || request.GitHubClient == null || request.Repository == null || request.DbRepository == null)
                throw new Exception($"{nameof(FillPBIsWithTasksCommandHandler)} - null elements in the command");
            if (request.DbRepository.GitHubId != request.Repository.Id)
                throw new Exception($"{nameof(FillPBIsWithTasksCommandHandler)} - repositories are not matching");

            var repositoryIssueRequest = new Octokit.RepositoryIssueRequest
            {
                State = Octokit.ItemStateFilter.All
            };

            var issuesAndPullRequests = request.GitHubClient.Issue.GetAllForRepository(request.Repository.Id, repositoryIssueRequest).Result;
            if (issuesAndPullRequests == null)
                throw new NotFoundException("Issues not found");

            var issues = issuesAndPullRequests.Where(iss => iss.PullRequest == null);

            _gitHubResynchronization.ResynchronizeIssues(request.Repository, issues, request.GitHubClient, _dbContext);

            // Fill Issues huh?
            var repoTasks = request.DbRepository.GetTasksForRepository(_dbContext);

            Dictionary<long, IEnumerable<SHTask>> pbiToTaskList = new();

            foreach (var pbi in request.BacklogItems)
            {
                var filteredTasks = repoTasks.Where(rt => pbi.Id <= 0 ? (rt.PBI == null || rt.PBI <= 0) : (rt.PBI != null && rt.PBI == pbi.Id));
                var filteredIssues = filteredTasks.Select(rt => issues.FirstOrDefault(iss => iss.Id == rt.GitHubIssueId) ?? null);
                var notNullIssues = filteredIssues.Where(iss => iss != null).Select(iss => iss!);
                var transformedTasks = notNullIssues.Select(rt => new SHTask(rt, _dbContext));

                pbiToTaskList[pbi.Id] = transformedTasks;
            }

            return Task.FromResult(pbiToTaskList);
        }
    }
}
