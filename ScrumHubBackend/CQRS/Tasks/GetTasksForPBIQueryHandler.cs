﻿using MediatR;
using ScrumHubBackend.CommunicationModel.Common;
using ScrumHubBackend.GitHubClient;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Handler for getting tasks for the PBI
    /// </summary>
    public class GetTasksForPBIQueryHandler : IRequestHandler<GetTasksForPBIQuery, PaginatedList<Unit>>
    {
        private readonly ILogger<GetTasksForPBIQueryHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;

        /// <summary>
        /// Constructor
        /// </summary>
        public GetTasksForPBIQueryHandler(ILogger<GetTasksForPBIQueryHandler> logger, IGitHubClientFactory clientFactory, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
        }

        /// <inheritdoc/>
        public Task<PaginatedList<Unit>> Handle(GetTasksForPBIQuery request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
