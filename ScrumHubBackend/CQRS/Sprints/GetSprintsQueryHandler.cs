using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.Sprints
{
    /// <summary>
    /// Handler for getting sprints
    /// </summary>
    public class GetSprintsQueryHandler : IRequestHandler<GetSprintsQuery, PaginatedList<Sprint>>
    {
        private readonly ILogger<GetSprintsQueryHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;

        /// <summary>
        /// Constructor
        /// </summary>
        public GetSprintsQueryHandler(ILogger<GetSprintsQueryHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
        }

        /// <inheritdoc/>
        public Task<PaginatedList<Sprint>> Handle(GetSprintsQuery request, CancellationToken cancellationToken)
        {
            if (request == null || request.AuthToken == null)
                throw new BadHttpRequestException("Missing token");

            var gitHubClient = _gitHubClientFactory.Create(request.AuthToken);

            // If it does not exists then user does not have permissions to read id
            var repository = gitHubClient.Repository.Get(request.RepositoryOwner, request.RepositoryName).Result;

            var dbRepository = _dbContext.Repositories?.FirstOrDefault(repo => repo.FullName == repository.FullName);

            if (dbRepository == null)
                throw new NotFoundException("Repository not found in ScrumHub");

            var sprintsForRepository = dbRepository.GetSprintsForRepository(_dbContext);

            return Task.FromResult(FilterAndPaginatePBIs(sprintsForRepository ?? new List<DatabaseModel.Sprint>(), request.PageNumber, request.PageSize));
        }

        /// <summary>
        /// Paginates sprints and transforms them to model repositories
        /// </summary>
        protected virtual PaginatedList<Sprint> FilterAndPaginatePBIs(IEnumerable<DatabaseModel.Sprint> sprints, int pageNumber, int pageSize)
        {
            var sortedSprints = sprints.OrderBy(pbi => pbi.SprintNumber);
            int startIndex = pageSize * (pageNumber - 1);
            int endIndex = Math.Min(startIndex + pageSize, sortedSprints.Count());
            var paginatedSprints = sortedSprints.Take(new Range(startIndex, endIndex));
            var transformedSprints = paginatedSprints.Select(sprint => new Sprint(sprint, _dbContext));

            int pagesCount = (int)Math.Ceiling(sortedSprints.Count() / (double)pageSize);
            return new PaginatedList<Sprint>(transformedSprints, pageNumber, pageSize, pagesCount);
        }
    }
}
