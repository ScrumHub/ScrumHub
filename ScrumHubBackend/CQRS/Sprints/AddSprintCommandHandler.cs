using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.Sprints
{
    /// <summary>
    /// Handler for adding new sprint
    /// </summary>
    public class AddSprintCommandHandler : IRequestHandler<AddSprintCommand, Sprint>
    {
        private readonly ILogger<AddSprintCommandHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;
        private readonly IMediator _mediator;

        /// <summary>
        /// Constructor
        /// </summary>
        public AddSprintCommandHandler(ILogger<AddSprintCommandHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext, IMediator mediator)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
            _mediator = mediator ?? throw new ArgumentException(null, nameof(mediator));
        }

        /// <inheritdoc/>
        public Task<Sprint> Handle(AddSprintCommand request, CancellationToken cancellationToken)
        {
            if (request == null || request.AuthToken == null)
                throw new BadHttpRequestException("Missing token");

            var gitHubClient = _gitHubClientFactory.Create(request.AuthToken);

            var repository = gitHubClient.Repository.Get(request.RepositoryOwner, request.RepositoryName).Result;

            var dbRepository = _dbContext.Repositories?.FirstOrDefault(repo => repo.FullName == repository.FullName);

            if (dbRepository == null)
                throw new NotFoundException("Repository not found in ScrumHub");

            if (!repository.Permissions.Admin)
                throw new ForbiddenException("Not enough permissions to add sprint to repository");

            var sprintsForRepository = dbRepository.GetSprintsForRepository(_dbContext);
            var pbisForRepository = dbRepository.GetPBIsForRepository(_dbContext);

            var repositoryPBIs = dbRepository.GetPBIsForRepository(_dbContext);

            var pbisNullable = request.PBIs?.Select(pbiId => repositoryPBIs.FirstOrDefault(pbi => pbi.Id == pbiId)).ToList() ?? new List<DatabaseModel.BacklogItem?>();

            pbisNullable.RemoveAll(pbi => pbi == null);

            var pbis = pbisNullable.Select(pbi => pbi!);

            if (!pbis.All(pbi => pbisForRepository?.Any(repoPbi => repoPbi.Id == pbi.Id) ?? false))
            {
                throw new NotFoundException("PBI requested to be in the sprint does not exists");
            }

            if (pbis.Any(pbi => pbi?.ExpectedTimeInHours <= 0))
            {
                throw new BadHttpRequestException("Cannot create sprint from not estimated PBIs");
            }

            if (pbis.Any(pbi => (pbi?.SprintId ?? 0) > 0))
            {
                throw new BadHttpRequestException("Cannot create sprint from already assigned PBI");
            }

            var dbSprint = new DatabaseModel.Sprint(request.Goal ?? String.Empty, request.Title ?? String.Empty, request.FinishDate, dbRepository.Id, _dbContext);

            _dbContext.Update(dbRepository);
            _dbContext.Add(dbSprint);
            _dbContext.SaveChanges();

            foreach(var pbi in pbis)
            {
                pbi.SprintId = dbSprint.SprintNumber;
                _dbContext.Update(pbi);
            }

            _dbContext.SaveChanges();

            return Task.FromResult(new Sprint(dbSprint, gitHubClient, repository, dbRepository, request, _dbContext, _mediator, true));
        }
    }
}
