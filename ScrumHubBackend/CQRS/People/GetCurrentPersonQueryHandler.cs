using MediatR;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.People
{
    /// <summary>
    /// Handler for query for getting currently logged person
    /// </summary>
    public class GetCurrentPersonQueryHandler : IRequestHandler<GetCurrentPersonQuery, Person>
    {
        private readonly ILogger<GetCurrentPersonQueryHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;

        /// <summary>
        /// Constructor
        /// </summary>
        public GetCurrentPersonQueryHandler(ILogger<GetCurrentPersonQueryHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
        }

        /// <inheritdoc/>
        public Task<Person> Handle(GetCurrentPersonQuery request, CancellationToken cancellationToken)
        {
            if (request == null || request.AuthToken == null)
                throw new BadHttpRequestException("Missing token");

            var gitHubClient = _gitHubClientFactory.Create(request.AuthToken);

            var currentUser = gitHubClient.User.Current().Result;

            return Task.FromResult(new Person(currentUser, currentUser.Id));
        }
    }
}
