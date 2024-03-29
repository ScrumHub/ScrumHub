﻿using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;
using ScrumHubBackend.CQRS.Tasks;
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
        private readonly IMediator _mediator;

        /// <summary>
        /// Constructor
        /// </summary>
        public GetPBIsQueryHandler(ILogger<GetPBIsQueryHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext, IMediator mediator)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
            _mediator = mediator ?? throw new ArgumentException(null, nameof(mediator));
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

            var paginatedPBIs = FilterAndPaginatePBIs(request, _dbContext.BacklogItems?.Where(pbi => pbi.RepositoryId == dbRepository.Id).ToList() ?? new List<DatabaseModel.BacklogItem>(), request.PageNumber, request.PageSize, request.NameFilter, request.FinishedFilter, request.EstimatedFilter, request.InSprintFilter, request.OnePage);

            var fillTasksCommand = new FillPBIsWithTasksCommand()
            {
                GitHubClient = gitHubClient,
                Repository = repository,
                DbRepository = dbRepository,
                BacklogItems = paginatedPBIs.List
            };

            var pbiTasks = _mediator.Send(fillTasksCommand, cancellationToken).Result;

            foreach (var pbi in paginatedPBIs.List)
            {
                pbi.AddTasks(pbiTasks[pbi.Id]);
            }

            return Task.FromResult(paginatedPBIs);
        }

        /// <summary>
        /// Filters and paginates PBIs and transforms them to model repositories
        /// </summary>
        public virtual PaginatedList<BacklogItem> FilterAndPaginatePBIs(ICommonInRepositoryRequest request, IEnumerable<DatabaseModel.BacklogItem> PBIs, int pageNumber, int pageSize, string? nameFilter, bool? finishedFilter, bool? estimatedFilter, bool? inSprintFilter, bool? onePage)
        {
            var filteredPBIsName = PBIs.Where(pbi => pbi.Name.ToLower().Contains(nameFilter?.ToLower() ?? ""));
            var filteredPBIsFinished = filteredPBIsName.Where(pbi => finishedFilter == null || pbi.Finished == finishedFilter);
            var filteredPBIsInSprint = filteredPBIsFinished.Where(pbi => inSprintFilter == null || ((pbi.SprintId != null && pbi.SprintId > 0) == inSprintFilter));
            var filteredPBIsEstimated = filteredPBIsInSprint.Where(pbi => estimatedFilter == null || pbi.ExpectedTimeInHours > 0 == estimatedFilter.Value);
            var sortedPBIs = filteredPBIsEstimated.OrderByDescending(pbi => pbi.Priority).ThenBy(pbi => pbi.Name);
            if (onePage.HasValue && onePage.Value)
            {
                pageNumber = 1;
                pageSize = sortedPBIs.Count();
            }
            int startIndex = pageSize * (pageNumber - 1);
            int endIndex = Math.Min(startIndex + pageSize, sortedPBIs.Count());
            var paginatedPBIs = sortedPBIs.Take(new Range(startIndex, endIndex));
            var transformedPBIs = paginatedPBIs.Select(pbi => new BacklogItem(pbi.Id, request, _dbContext, _mediator, false));

            int pagesCount = (int)Math.Ceiling(sortedPBIs.Count() / (double)pageSize);
            return new PaginatedList<BacklogItem>(transformedPBIs.ToList(), pageNumber, pageSize, pagesCount);
        }
    }
}
