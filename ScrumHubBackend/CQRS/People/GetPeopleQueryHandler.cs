using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;
using ScrumHubBackend.CustomExceptions;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.People
{
    /// <summary>
    /// Handler for getting people for repository
    /// </summary>
    public class GetPeopleQueryHandler : IRequestHandler<GetPeopleQuery, PaginatedList<Person>>
    {
        private readonly ILogger<GetPeopleQueryHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;

        /// <summary>
        /// Constructor
        /// </summary>
        public GetPeopleQueryHandler(ILogger<GetPeopleQueryHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
        }

        /// <inheritdoc/>
        public Task<PaginatedList<Person>> Handle(GetPeopleQuery request, CancellationToken cancellationToken)
        {
            if (request == null || request.AuthToken == null)
                throw new BadHttpRequestException("Missing token");

            var gitHubClient = _gitHubClientFactory.Create(request.AuthToken);

            // If it does not exists then user does not have permissions to read id
            var repository = gitHubClient.Repository.Get(request.RepositoryOwner, request.RepositoryName).Result;

            var dbRepository = _dbContext.Repositories?.FirstOrDefault(repo => repo.FullName == repository.FullName);

            if (dbRepository == null)
                throw new NotFoundException("Repository not found in ScrumHub");

            var collabolators = gitHubClient.Repository.Collaborator.GetAll(repository.Id).Result;
            var collabolatorsSh = collabolators.Select(user => new Person(user));

            return Task.FromResult(new PaginatedList<Person>(collabolatorsSh, 1, collabolatorsSh.Count(), 1));
        }
    }
}
