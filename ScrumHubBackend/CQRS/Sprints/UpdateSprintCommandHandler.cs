using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.Sprints
{
    /// <summary>
    /// Handler for updating a sprint
    /// </summary>
    public class UpdateSprintCommandHandler : IRequestHandler<UpdateSprintCommand, Sprint>
    {
        private readonly ILogger<UpdateSprintCommandHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;
        private readonly IMediator _mediator;

        /// <summary>
        /// Constructor
        /// </summary>
        public UpdateSprintCommandHandler(ILogger<UpdateSprintCommandHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext, IMediator mediator)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
            _mediator = mediator ?? throw new ArgumentException(null, nameof(mediator));
        }

        /// <inheritdoc/>
        public Task<Sprint> Handle(UpdateSprintCommand request, CancellationToken cancellationToken)
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

            var dbSprint = sprintsForRepository.FirstOrDefault(sprint => sprint.SprintNumber == request.Number);

            if (dbSprint == null)
            {
                throw new BadHttpRequestException("Sprint with given number does not exist");
            }

            dbSprint.Goal = request.Goal ?? String.Empty;
            dbSprint.Title = request.Title ?? String.Empty;
            dbSprint.FinishDate = request.FinishDate;

            var pbisForSprint = dbSprint.GetPBIsForSprint(pbisForRepository);

            foreach (var dbPbi in pbisForSprint)
            {
                dbPbi.SprintId = null;
                _dbContext.Update(dbPbi);
            }

            foreach(var pbiId in request?.PBIs ?? new List<long>())
            {
                var dbPbi = pbisForRepository.FirstOrDefault(pbi => pbi.Id == pbiId);

                if(dbPbi == null)
                    throw new NotFoundException("PBI requested to be in the sprint does not exists");
                if(dbPbi.SprintId != null || dbPbi.SprintId > 0)
                    throw new BadHttpRequestException("Cannot create sprint from already assigned PBI");
                if(dbPbi.ExpectedTimeInHours <= 0)
                    throw new BadHttpRequestException("Cannot create sprint from not estimated PBIs");

                dbPbi.SprintId = request?.Number;
                _dbContext.Update(dbPbi);
            }

            _dbContext.Update(dbSprint);
            _dbContext.SaveChanges();

            return Task.FromResult(new Sprint(dbSprint, request, _dbContext, _mediator));
        }
    }
}
