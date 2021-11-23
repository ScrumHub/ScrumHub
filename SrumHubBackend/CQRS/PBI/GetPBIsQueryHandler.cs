using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.PBI
{
    /// <summary>
    /// Handler getting all PBIs from repository
    /// </summary>
    public class GetPBIsQueryHandler : IRequestHandler<GetPBIsQuery, PaginatedList<BacklogItem>>
    {
        private readonly ILogger<GetPBIsQueryHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;

        /// <summary>
        /// Constructor
        /// </summary>
        public GetPBIsQueryHandler(ILogger<GetPBIsQueryHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
        }

        /// <inheritdoc/>
        public Task<PaginatedList<BacklogItem>> Handle(GetPBIsQuery request, CancellationToken cancellationToken)
        {
            if (request == null || request.AuthToken == null)
                throw new BadHttpRequestException("Missing token");

            var gitHubClient = _gitHubClientFactory.Create(request.AuthToken);

            // If it does not exists then user does not have permissions to read id
            var repository = gitHubClient.Repository.Get(request.RepositoryOwner, request.RepositoryName).Result;

            var dbRepository = _dbContext.Repositories?.FirstOrDefault(repo => repo.FullName == repository.FullName);

            if (dbRepository == null)
                throw new NotFoundException("Repository not found in ScrumHub");

            var paginatedPBIs = FilterAndPaginatePBIs(dbRepository?.BacklogItems ?? new List<DatabaseModel.BacklogItem>(), request.PageNumber, request.PageSize, request.NameFilter, request.FinishedFilter, request.EstimatedFilter);

            return Task.FromResult(paginatedPBIs);
        }

        /// <summary>
        /// Filters and paginates PBIs and transforms them to model repositories
        /// </summary>
        protected virtual PaginatedList<BacklogItem> FilterAndPaginatePBIs(IEnumerable<DatabaseModel.BacklogItem> repositories, int pageNumber, int pageSize, string? nameFilter, bool? finishedFilter, bool? estimatedFilter)
        {
            var filteredPBIsName = repositories.Where(pbi => pbi.Name.ToLower().Contains(nameFilter?.ToLower() ?? ""));
            var filteredPBIsFinished = filteredPBIsName.Where(pbi => finishedFilter == null || pbi.Finished == finishedFilter);
            var filteredPBIsEstimated = filteredPBIsFinished.Where(pbi => estimatedFilter == null || (pbi.ExpectedTimeInHours == 0 && !estimatedFilter.Value));
            var sortedPBIs = filteredPBIsEstimated.OrderByDescending(pbi => pbi.Priority).ThenBy(pbi => pbi.Name);
            int startIndex = pageSize * (pageNumber - 1);
            int endIndex = Math.Min(startIndex + pageSize, repositories.Count());
            var paginatedPBIs = sortedPBIs.Take(new Range(startIndex, endIndex));
            var transformedPBIs = paginatedPBIs.Select(pbi => new BacklogItem(pbi.Id, _dbContext));

            int pagesCount = (int)Math.Ceiling(sortedPBIs.Count() / (double)pageSize);
            return new PaginatedList<BacklogItem>(transformedPBIs, pageNumber, pageSize, pagesCount);
        }
    }
}
