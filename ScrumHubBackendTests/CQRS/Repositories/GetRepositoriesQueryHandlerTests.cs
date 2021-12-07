using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Octokit;
using ScrumHubBackend;
using ScrumHubBackend.CQRS.Repositories;
using ScrumHubBackend.DatabaseModel;
using ScrumHubBackend.GitHubClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace ScrumHubBackendTests.CQRS.Repositories
{
    public class GetRepositoriesQueryHandlerTests
    {
        #region User (GitHub)
        private static readonly User user = new(
            "",
            "",
            "",
            0,
            "",
            DateTimeOffset.MinValue,
            DateTimeOffset.MinValue,
            0,
            "example@email.org",
            0,
            0,
            false,
            "",
            0,
            1,
            "",
            "test",
            "test",
            "",
            0,
            null,
            0,
            0,
            2,
            "",
            null,
            false,
            "",
            null
            );
        #endregion

        #region Repositories (GitHub)
        private static readonly Octokit.Repository notSHRepo = new(
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                1,
                "",
                user,
                "NotInScrumHub",
                "test/NotInScrumHub",
                false,
                "Not in ScrumHub repo",
                "",
                "",
                false,
                false,
                0,
                0,
                "",
                0,
                DateTimeOffset.MinValue,
                DateTimeOffset.MinValue,
                DateTimeOffset.MinValue,
                new RepositoryPermissions(true, true, true),
                null,
                null,
                null,
                false,
                false,
                false,
                false,
                0,
                0,
                true,
                true,
                true,
                false,
                0,
                true,
                RepositoryVisibility.Public
                );
        private static readonly Octokit.Repository shRepo = new(
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                2,
                "",
                user,
                "InScrumHub",
                "test/InScrumHub",
                false,
                "Already in ScrumHub",
                "",
                "",
                false,
                false,
                0,
                0,
                "",
                0,
                DateTimeOffset.MinValue,
                DateTimeOffset.MinValue,
                DateTimeOffset.MinValue,
                new RepositoryPermissions(true, true, true),
                null,
                null,
                null,
                false,
                false,
                false,
                false,
                0,
                0,
                true,
                true,
                true,
                false,
                0,
                true,
                RepositoryVisibility.Public
                );

        private static readonly IReadOnlyList<Octokit.Repository> repositoryList = new List<Octokit.Repository>()
        {
            notSHRepo, shRepo
        };
        #endregion

        private static readonly DateTimeOffset baseDateTime = new DateTimeOffset(2021, 12, 12, 12, 0, 0, new TimeSpan(0));
        #region Activity (GitHub)
        private static readonly IReadOnlyList<Activity> activityList = new List<Activity>()
        {
            new Activity("PushEvent", true, notSHRepo, null, null, baseDateTime, String.Empty, null),
            new Activity("IssueCommentEvent", true, shRepo, null, null, baseDateTime.AddDays(-1), String.Empty, null),
            new Activity("PushEvent", true, notSHRepo, null, null, baseDateTime.AddDays(-2), String.Empty, null),
        };
        #endregion

        #region Repositories (ScrumHub)
        private static readonly List<ScrumHubBackend.DatabaseModel.Repository> repositoriesData = new()
        {
            new ScrumHubBackend.DatabaseModel.Repository { Id = 1, GitHubId = 2, FullName = "Test/InScrumHub" },
        };
        #endregion

        #region BacklogItems (ScrumHub)
        private static readonly List<BacklogItem> backlogItemsData = new()
        {
            new BacklogItem { Id = 1, RepositoryId = 1 },
            new BacklogItem { Id = 2, RepositoryId = 1 },
            new BacklogItem { Id = 3, RepositoryId = 1 },
            new BacklogItem { Id = 4, RepositoryId = 1 },
        };
        #endregion

        #region Sprints (ScrumHub)
        private static readonly List<Sprint> sprintsData = new()
        {
            new Sprint { Id = 10, SprintNumber = 2, RepositoryId = 1 },
            new Sprint { Id = 11, SprintNumber = 1, RepositoryId = 1 },
            new Sprint { Id = 12, SprintNumber = 4, RepositoryId = 1 },
            new Sprint { Id = 13, SprintNumber = 3, RepositoryId = 1 },
        };
        #endregion

        #region Settings
        private static readonly Dictionary<string, string> settings = new()
        {
            { "CacheTimers:Repository", "10" }
        };
        #endregion

        private static Mock<DatabaseContext> GetDatabaseContextMock()
        {
            var dbContextMock = new Mock<DatabaseContext>();

            var repos = repositoriesData.AsQueryable();
            var mockRepositoriesSet = new Mock<DbSet<ScrumHubBackend.DatabaseModel.Repository>>();
            mockRepositoriesSet.As<IQueryable<ScrumHubBackend.DatabaseModel.Repository>>().Setup(m => m.Provider).Returns(repos.Provider);
            mockRepositoriesSet.As<IQueryable<ScrumHubBackend.DatabaseModel.Repository>>().Setup(m => m.Expression).Returns(repos.Expression);
            mockRepositoriesSet.As<IQueryable<ScrumHubBackend.DatabaseModel.Repository>>().Setup(m => m.ElementType).Returns(repos.ElementType);
            mockRepositoriesSet.As<IQueryable<ScrumHubBackend.DatabaseModel.Repository>>().Setup(m => m.GetEnumerator()).Returns(repos.GetEnumerator());

            var backlogItems = backlogItemsData.AsQueryable();
            var mockBacklogItemSet = new Mock<DbSet<BacklogItem>>();
            mockBacklogItemSet.As<IQueryable<BacklogItem>>().Setup(m => m.Provider).Returns(backlogItems.Provider);
            mockBacklogItemSet.As<IQueryable<BacklogItem>>().Setup(m => m.Expression).Returns(backlogItems.Expression);
            mockBacklogItemSet.As<IQueryable<BacklogItem>>().Setup(m => m.ElementType).Returns(backlogItems.ElementType);
            mockBacklogItemSet.As<IQueryable<BacklogItem>>().Setup(m => m.GetEnumerator()).Returns(backlogItems.GetEnumerator());

            var sprints = sprintsData.AsQueryable();
            var mockSprintSet = new Mock<DbSet<Sprint>>();
            mockSprintSet.As<IQueryable<Sprint>>().Setup(m => m.Provider).Returns(sprints.Provider);
            mockSprintSet.As<IQueryable<Sprint>>().Setup(m => m.Expression).Returns(sprints.Expression);
            mockSprintSet.As<IQueryable<Sprint>>().Setup(m => m.ElementType).Returns(sprints.ElementType);
            mockSprintSet.As<IQueryable<Sprint>>().Setup(m => m.GetEnumerator()).Returns(sprints.GetEnumerator());

            dbContextMock.Setup(m => m.Repositories).Returns(mockRepositoriesSet.Object);
            dbContextMock.Setup(m => m.BacklogItems).Returns(mockBacklogItemSet.Object);
            dbContextMock.Setup(m => m.Sprints).Returns(mockSprintSet.Object);

            return dbContextMock;
        }

        [Fact]
        public void Handle_Should_ReturnProperRepositories()
        {
            // Mocking GitHubClient
            var gitHubClient = new Mock<IGitHubClient>(); 
            gitHubClient.Setup(m => m.User.Current().Result).Returns(user);
            gitHubClient.Setup(m => m.Activity.Events.GetAllUserPerformed(user.Login).Result).Returns(activityList);
            gitHubClient.Setup(m => m.Repository.GetAllForCurrent().Result).Returns(repositoryList);


            var loggerMock = new Mock<ILogger<GetRepositoriesQueryHandler>>();

            var gitHubClientFactoryMock = new Mock<IGitHubClientFactory>();
            gitHubClientFactoryMock.Setup(m => m.Create(String.Empty)).Returns(gitHubClient.Object);

            IConfiguration configuration = new ConfigurationBuilder().AddInMemoryCollection(settings).Build();

            var dbContextMock = GetDatabaseContextMock();

            var handler = new GetRepositoriesQueryHandler(loggerMock.Object, gitHubClientFactoryMock.Object, configuration, dbContextMock.Object);

            var query = new GetRepositoriesQuery()
            {
                AuthToken = String.Empty,
                PageNumber = 1,
                PageSize = 10,
                NameFilter = String.Empty
            };

            var cancToken = new CancellationToken();
            var result = handler.Handle(query, cancToken).Result;

            // General pagination
            Assert.Equal(1, result.PageCount);
            Assert.Equal(2, result.RealSize);
            Assert.Equal(2, result.List.Count());

            // Repo not in ScrumHub
            Assert.Equal("test/NotInScrumHub", result.List.ElementAt(0).Name);
            Assert.False(result.List.ElementAt(0).AlreadyInScrumHub);
            Assert.Empty(result.List.ElementAt(0).Sprints);
            Assert.Empty(result.List.ElementAt(0).BacklogItems);
            Assert.Equal(baseDateTime.ToString("yyyy-MM-dd HH:mm:ss 'UTC'"), result.List.ElementAt(0).DateOfLastActivity);
            Assert.Equal("Commits pushed to a branch or tag", result.List.ElementAt(0).TypeOfLastActivity);

            // Repo in ScrumHub
            Assert.Equal("Already in ScrumHub", result.List.ElementAt(1).Description);
            Assert.True(result.List.ElementAt(1).AlreadyInScrumHub);
            Assert.NotEmpty(result.List.ElementAt(1).Sprints);
            Assert.NotEmpty(result.List.ElementAt(1).BacklogItems);
            Assert.Contains(1, result.List.ElementAt(1).BacklogItems);
            Assert.Contains(1, result.List.ElementAt(1).Sprints);
            Assert.Equal(baseDateTime.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss 'UTC'"), result.List.ElementAt(1).DateOfLastActivity);
            Assert.Equal("Issue or pull request comment action", result.List.ElementAt(1).TypeOfLastActivity);
        } 
    }
}
