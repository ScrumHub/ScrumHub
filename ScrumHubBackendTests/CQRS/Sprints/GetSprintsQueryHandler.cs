using Microsoft.Extensions.Logging;
using Moq;
using ScrumHubBackend;
using ScrumHubBackend.DatabaseModel;
using ScrumHubBackend.GitHubClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace ScrumHubBackendTests.CQRS.Sprints
{
    public class GetSprintsQueryHandler
    {
        private static readonly List<Sprint> sprintsData = new()
        {
            new Sprint { Id = 1, SprintNumber = 1 },
            new Sprint { Id = 2, SprintNumber = 2 },
            new Sprint { Id = 3, SprintNumber = 5 },
            new Sprint { Id = 4, SprintNumber = 4 },
            new Sprint { Id = 5, SprintNumber = 6 },
            new Sprint { Id = 6, SprintNumber = 3 },
            new Sprint { Id = 7, SprintNumber = 8 },
            new Sprint { Id = 8, SprintNumber = 7 },
        };

        [Fact]
        public void FilterAndPaginateSprints_Should_ReturnProperList()
        {
            var loggerMock = new Mock<ILogger<ScrumHubBackend.CQRS.Sprints.GetSprintsQueryHandler>>();
            var gitHubClientFactoryMock = new Mock<IGitHubClientFactory>();
            var dbContextMock = new Mock<DatabaseContext>();

            var handler = new ScrumHubBackend.CQRS.Sprints.GetSprintsQueryHandler(loggerMock.Object, gitHubClientFactoryMock.Object, dbContextMock.Object);

            var res1 = handler.FilterAndPaginateSprints(sprintsData, 1, 3);
            var res2 = handler.FilterAndPaginateSprints(sprintsData, 2, 3);
            var res3 = handler.FilterAndPaginateSprints(sprintsData, 3, 3);
            var res4 = handler.FilterAndPaginateSprints(sprintsData, 4, 3);

            Assert.Equal(3, res1.RealSize);
            Assert.Equal(3, res2.RealSize);
            Assert.Equal(2, res3.RealSize);
            Assert.Equal(0, res4.RealSize);

            Assert.Equal(3, res1.PageCount);
            Assert.Equal(3, res2.PageCount);
            Assert.Equal(3, res3.PageCount);
            Assert.Equal(3, res4.PageCount);

            Assert.Equal(4, res2.List.ElementAt(0).SprintNumber);
            Assert.Equal(5, res2.List.ElementAt(1).SprintNumber);
            Assert.Equal(6, res2.List.ElementAt(2).SprintNumber);

            Assert.Empty(res4.List);
        }
    }
}
