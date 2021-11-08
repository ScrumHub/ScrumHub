using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.Repositories
{
    /// <summary>
    /// Handler for adding the repository to ScrumHub
    /// </summary>
    public class AddRepositoryToScrumHubCommandHandler : IRequestHandler<AddRepositoryToScrumHubCommand, Repository>
    {
        private readonly ILogger<AddRepositoryToScrumHubCommandHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;

        /// <summary>
        /// Constructor
        /// </summary>
        public AddRepositoryToScrumHubCommandHandler(ILogger<AddRepositoryToScrumHubCommandHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
        }

        /// <inheritdoc/>
        public Task<Repository> Handle(AddRepositoryToScrumHubCommand request, CancellationToken cancellationToken)
        {
            if (request == null || request.AuthToken == null)
                throw new BadHttpRequestException("Missing token");

            var gitHubClient = _gitHubClientFactory.Create(request.AuthToken);

            var user = gitHubClient.User.Current().Result;

            var repository = gitHubClient.Repository.Get(request.RepositoryId).Result;

            if (!repository.Permissions.Admin)
                throw new ForbiddenException("Not enough permissions to add repository to ScrumHub");

            if (_dbContext.Repositories?.Any(internalRepository => internalRepository.GitHubId == request.RepositoryId) ?? false)
                throw new ConflictException("Repository already exists in ScrumHub");

            _dbContext.Add(new DatabaseModel.Repository(repository));
            _dbContext.SaveChanges();

            _logger.LogInformation("Added repository {} to SrumHub by user {}", repository.FullName, user.Login);

            return Task.FromResult(new Repository(repository, _dbContext));
        }
    }
}
