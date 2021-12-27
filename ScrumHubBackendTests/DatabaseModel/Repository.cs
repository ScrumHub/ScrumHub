using Microsoft.EntityFrameworkCore;
using Moq;
using ScrumHubBackend;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace ScrumHubBackendTests.DatabaseModel
{
    public class Repository
    {
        private static readonly List<ScrumHubBackend.DatabaseModel.Sprint> sprintsData = new()
        {
            new ScrumHubBackend.DatabaseModel.Sprint()
            {
                RepositoryId = 1,
                Id = 1,
            },
            new ScrumHubBackend.DatabaseModel.Sprint()
            {
                RepositoryId = 1,
                Id = 2,
            },
            new ScrumHubBackend.DatabaseModel.Sprint()
            {
                RepositoryId = 2,
                Id = 3,
            },
        };

        private static readonly List<ScrumHubBackend.DatabaseModel.BacklogItem> pbiData = new()
        {
            new ScrumHubBackend.DatabaseModel.BacklogItem()
            {
                RepositoryId = 1,
                Id = 1,
            },
            new ScrumHubBackend.DatabaseModel.BacklogItem()
            {
                RepositoryId = 1,
                Id = 2,
            },
            new ScrumHubBackend.DatabaseModel.BacklogItem()
            {
                RepositoryId = 2,
                Id = 3,
            },
        };

        private static readonly List<ScrumHubBackend.DatabaseModel.SHTask> taskData = new()
        {
            new ScrumHubBackend.DatabaseModel.SHTask()
            {
                RepositoryId = 1,
                Id = 1,
            },
            new ScrumHubBackend.DatabaseModel.SHTask()
            {
                RepositoryId = 1,
                Id = 2,
            },
            new ScrumHubBackend.DatabaseModel.SHTask()
            {
                RepositoryId = 2,
                Id = 3,
            },
        };

        [Fact]
        public void GetSprintsForRepository_Should_ReturnProperSprints()
        {
            var sData = sprintsData.AsQueryable();

            var mockSprintSet = new Mock<DbSet<ScrumHubBackend.DatabaseModel.Sprint>>();
            mockSprintSet.As<IQueryable<ScrumHubBackend.DatabaseModel.Sprint>>().Setup(m => m.Provider).Returns(sData.Provider);
            mockSprintSet.As<IQueryable<ScrumHubBackend.DatabaseModel.Sprint>>().Setup(m => m.Expression).Returns(sData.Expression);
            mockSprintSet.As<IQueryable<ScrumHubBackend.DatabaseModel.Sprint>>().Setup(m => m.ElementType).Returns(sData.ElementType);
            mockSprintSet.As<IQueryable<ScrumHubBackend.DatabaseModel.Sprint>>().Setup(m => m.GetEnumerator()).Returns(sData.GetEnumerator());

            var mockContext = new Mock<DatabaseContext>();
            mockContext.Setup(m => m.Sprints).Returns(mockSprintSet.Object);

            var repo1 = new ScrumHubBackend.DatabaseModel.Repository()
            {
                Id = 1
            };
            var repo2 = new ScrumHubBackend.DatabaseModel.Repository()
            {
                Id = 2
            };

            var sprints1 = repo1.GetSprintsForRepository(mockContext.Object).Select(spr => spr.Id);
            var sprints2 = repo2.GetSprintsForRepository(mockContext.Object).Select(spr => spr.Id);

            Assert.Contains(1, sprints1);
            Assert.Contains(2, sprints1);
            Assert.Contains(3, sprints2);
        }

        [Fact]
        public void GetPBIsForRepository_Should_ReturnProperPBIs()
        {
            var pData = pbiData.AsQueryable();

            var mockPbiSet = new Mock<DbSet<ScrumHubBackend.DatabaseModel.BacklogItem>>();
            mockPbiSet.As<IQueryable<ScrumHubBackend.DatabaseModel.BacklogItem>>().Setup(m => m.Provider).Returns(pData.Provider);
            mockPbiSet.As<IQueryable<ScrumHubBackend.DatabaseModel.BacklogItem>>().Setup(m => m.Expression).Returns(pData.Expression);
            mockPbiSet.As<IQueryable<ScrumHubBackend.DatabaseModel.BacklogItem>>().Setup(m => m.ElementType).Returns(pData.ElementType);
            mockPbiSet.As<IQueryable<ScrumHubBackend.DatabaseModel.BacklogItem>>().Setup(m => m.GetEnumerator()).Returns(pData.GetEnumerator());

            var mockContext = new Mock<DatabaseContext>();
            mockContext.Setup(m => m.BacklogItems).Returns(mockPbiSet.Object);

            var repo1 = new ScrumHubBackend.DatabaseModel.Repository()
            {
                Id = 1
            };
            var repo2 = new ScrumHubBackend.DatabaseModel.Repository()
            {
                Id = 2
            };

            var pbis1 = repo1.GetPBIsForRepository(mockContext.Object).Select(pbi => pbi.Id);
            var pbis2 = repo2.GetPBIsForRepository(mockContext.Object).Select(pbi => pbi.Id);

            Assert.Contains(1, pbis1);
            Assert.Contains(2, pbis1);
            Assert.Contains(3, pbis2);
        }

        [Fact]
        public void GetTasksForRepository_Should_ReturnProperTasks()
        {
            var tData = taskData.AsQueryable();

            var mockTestSet = new Mock<DbSet<ScrumHubBackend.DatabaseModel.SHTask>>();
            mockTestSet.As<IQueryable<ScrumHubBackend.DatabaseModel.SHTask>>().Setup(m => m.Provider).Returns(tData.Provider);
            mockTestSet.As<IQueryable<ScrumHubBackend.DatabaseModel.SHTask>>().Setup(m => m.Expression).Returns(tData.Expression);
            mockTestSet.As<IQueryable<ScrumHubBackend.DatabaseModel.SHTask>>().Setup(m => m.ElementType).Returns(tData.ElementType);
            mockTestSet.As<IQueryable<ScrumHubBackend.DatabaseModel.SHTask>>().Setup(m => m.GetEnumerator()).Returns(tData.GetEnumerator());

            var mockContext = new Mock<DatabaseContext>();
            mockContext.Setup(m => m.Tasks).Returns(mockTestSet.Object);

            var repo1 = new ScrumHubBackend.DatabaseModel.Repository()
            {
                Id = 1
            };
            var repo2 = new ScrumHubBackend.DatabaseModel.Repository()
            {
                Id = 2
            };

            var tasks1 = repo1.GetTasksForRepository(mockContext.Object).Select(pbi => pbi.Id);
            var tasks2 = repo2.GetTasksForRepository(mockContext.Object).Select(pbi => pbi.Id);

            Assert.Contains(1, tasks1);
            Assert.Contains(2, tasks1);
            Assert.Contains(3, tasks2);
        }
    }
}
