using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.DatabaseModel;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.PBI
{
    /// <summary>
    /// Handler for updating a PBI
    /// </summary>
    public class UpdatePBICommandHandler : IRequestHandler<UpdatePBICommand, CommunicationModel.BacklogItem>
    {
        private readonly ILogger<UpdatePBICommandHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;

        /// <summary>
        /// Constructor
        /// </summary>
        public UpdatePBICommandHandler(ILogger<UpdatePBICommandHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
        }

        /// <inheritdoc/>
        public Task<CommunicationModel.BacklogItem> Handle(UpdatePBICommand request, CancellationToken cancellationToken)
        {
            if (request == null || request.AuthToken == null)
                throw new BadHttpRequestException("Missing token");

            var gitHubClient = _gitHubClientFactory.Create(request.AuthToken);

            var repository = gitHubClient.Repository.Get(request.RepositoryOwner, request.RepositoryName).Result;

            var dbRepository = _dbContext.Repositories?.FirstOrDefault(repo => repo.FullName == repository.FullName);

            if (dbRepository == null)
                throw new NotFoundException("Repository not found in ScrumHub");

            if (!repository.Permissions.Admin)
                throw new ForbiddenException("Not enough permissions to edit a PBI to repository");

            var pbi = dbRepository?.BacklogItems?.FirstOrDefault(pbi => pbi.Id == request.PBIId) ?? null;

            if (pbi == null)
                throw new NotFoundException("Backlog item not found in ScrumHub");

            pbi.Name = request.Name ?? String.Empty;
            pbi.Priority = request.Priority;

            foreach(var criterium in pbi.AcceptanceCriteria ?? new List<AcceptanceCriterium>())
            {
                _dbContext.Remove(criterium);
            }

            pbi.AcceptanceCriteria = new List<AcceptanceCriterium>();

            foreach (var criterium in request.AcceptanceCriteria ?? new List<string>())
            {
                pbi.AcceptanceCriteria.Add(new AcceptanceCriterium(criterium));
            }

            _dbContext.Update(pbi);
            _dbContext.SaveChanges();

            return System.Threading.Tasks.Task.FromResult(new CommunicationModel.BacklogItem(pbi.Id, _dbContext));
        }
    }
}
