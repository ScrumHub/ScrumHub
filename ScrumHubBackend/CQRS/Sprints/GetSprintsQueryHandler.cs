using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;
using ScrumHubBackend.CQRS.Tasks;
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
        private readonly IMediator _mediator;

        /// <summary>
        /// Constructor
        /// </summary>
        public GetSprintsQueryHandler(ILogger<GetSprintsQueryHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext, IMediator mediator)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
            _mediator = mediator ?? throw new ArgumentException(null, nameof(mediator));
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

            var result = FilterAndPaginateSprints(request, sprintsForRepository ?? new List<DatabaseModel.Sprint>(), request.PageNumber, request.PageSize, request.CompletedFilter, request.OnePage);

            var allPBIs = result.List.Aggregate((IEnumerable<BacklogItem>)new List<BacklogItem>(), (list, sprint) => list.Concat(sprint.BacklogItems ?? new List<BacklogItem>()));

            var fillTasksCommand = new FillPBIsWithTasksCommand()
            {
                GitHubClient = gitHubClient,
                Repository = repository,
                DbRepository = dbRepository,
                BacklogItems = allPBIs
            };

            var pbiTasks = _mediator.Send(fillTasksCommand, cancellationToken).Result;

            foreach(var pbi in allPBIs)
            {
                pbi.AddTasks(pbiTasks[pbi.Id]);
            }

            return Task.FromResult(result);
        }

        /// <summary>
        /// Paginates sprints and transforms them to model repositories
        /// </summary>
        public virtual PaginatedList<Sprint> FilterAndPaginateSprints(ICommonInRepositoryRequest request, IEnumerable<DatabaseModel.Sprint> sprints, int pageNumber, int pageSize, bool? completedFilter, bool? onePage)
        {
            var filteredSprints = sprints.Where(sprint => completedFilter == null || (sprint.Status != Common.SprintStatus.NotFinished) == completedFilter.Value);
            var sortedSprints = filteredSprints.OrderBy(sprint => sprint.SprintNumber);
            if (onePage.HasValue && onePage.Value)
            {
                pageNumber = 1;
                pageSize = sortedSprints.Count();
            }
            int startIndex = pageSize * (pageNumber - 1);
            int endIndex = Math.Min(startIndex + pageSize, sortedSprints.Count());
            var paginatedSprints = sortedSprints.Take(new Range(startIndex, endIndex));
            var transformedSprints = paginatedSprints.Select(sprint => new Sprint(sprint, request, _dbContext, _mediator, false));

            int pagesCount = (int)Math.Ceiling(sortedSprints.Count() / (double)pageSize);
            return new PaginatedList<Sprint>(transformedSprints.ToList(), pageNumber, pageSize, pagesCount);
        }
    }
}
