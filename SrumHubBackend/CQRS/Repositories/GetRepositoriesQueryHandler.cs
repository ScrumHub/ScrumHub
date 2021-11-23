﻿using MediatR;
using Microsoft.EntityFrameworkCore;
using ScrumHubBackend.GitHubClient;
using ScrumHubBackend.CommunicationModel.Common;
using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.CQRS.Repositories
{
    /// <summary>
    /// Handler getting all repositories for an user
    /// </summary>
    public class GetRepositoriesQueryHandler : IRequestHandler<GetRepositoriesQuery, PaginatedList<Repository>>
    {
        private readonly ILogger<GetRepositoriesQueryHandler> _logger;
        private readonly IGitHubClientFactory _gitHubClientFactory;
        private readonly DatabaseContext _dbContext;
        private readonly double _cacheTimer;

        private static readonly Dictionary<long, (IReadOnlyList<Octokit.Repository> repositories, DateTime lastUpdate)> _cachedRepositories = new();

        /// <summary>
        /// Constructor
        /// </summary>
        public GetRepositoriesQueryHandler(ILogger<GetRepositoriesQueryHandler> logger, IGitHubClientFactory clientFactory, IConfiguration configuration, DatabaseContext dbContext)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _dbContext = dbContext ?? throw new ArgumentException(null, nameof(dbContext));
            _gitHubClientFactory = clientFactory ?? throw new ArgumentException(null, nameof(clientFactory));
            _cacheTimer = configuration.GetSection(GlobalSettings.cacheTimerSettingsSectionKey).GetValue<double>(nameof(Repository));
        }

        /// <inheritdoc/>
        public Task<PaginatedList<Repository>> Handle(GetRepositoriesQuery request, CancellationToken cancellationToken)
        {
            if (request == null || request.AuthToken == null)
                throw new BadHttpRequestException("Missing token");

            var gitHubClient = _gitHubClientFactory.Create(request.AuthToken);

            var user = gitHubClient.User.Current().Result;

            IReadOnlyList<Octokit.Repository> repositories;

            //If we had not cached repositories for the user or we last checked him more than 5 minutes ago - get them again
            if (!_cachedRepositories.TryGetValue(user.Id, out var cachedRepositories)
                || DateTime.UtcNow.Subtract(cachedRepositories.lastUpdate).TotalMinutes >= _cacheTimer)
            {
                var updatedRepositories = GetRepositoriesForCurrentUser(gitHubClient).Result;
                _cachedRepositories[user.Id] = (updatedRepositories, DateTime.UtcNow);
                repositories = updatedRepositories;
            }
            else
            {
                repositories = cachedRepositories.repositories;
            }

            var paginatedRepositories = FilterAndPaginateRepositories(repositories, request.PageNumber, request.PageSize, request.NameFilter);

            return Task.FromResult(paginatedRepositories);
        }

        /// <summary>
        /// Gets repositories of user that is logged in
        /// </summary>
        protected virtual Task<IReadOnlyList<Octokit.Repository>> GetRepositoriesForCurrentUser(Octokit.GitHubClient client)
            => client.Repository.GetAllForCurrent();

        /// <summary>
        /// Filters and paginates downloaded repositories and transforms them to model repositories
        /// </summary>
        protected virtual PaginatedList<Repository> FilterAndPaginateRepositories(IEnumerable<Octokit.Repository> repositories, int pageNumber, int pageSize, string? nameFilter)
        {
            var filteredRepositories = repositories.Where(repository => repository.FullName.ToLower().Contains(nameFilter?.ToLower() ?? ""));
            var sortedRepositories = filteredRepositories.OrderBy(repository => repository.FullName);
            int startIndex = pageSize * (pageNumber - 1);
            int endIndex = Math.Min(startIndex + pageSize, repositories.Count());
            var paginatedRepositories = sortedRepositories.Take(new Range(startIndex, endIndex));
            var transformedRepositories = paginatedRepositories.Select(repository => new Repository(repository, _dbContext));

            int pagesCount = (int)Math.Ceiling(sortedRepositories.Count() / (double)pageSize);
            return new PaginatedList<Repository>(transformedRepositories, pageNumber, pageSize, pagesCount);
        }
    }
}
