using ScrumHubBackend.DatabaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace ScrumHubBackendTests.DatabaseModel
{
    public class Sprint
    {
        private static readonly List<ScrumHubBackend.DatabaseModel.BacklogItem> pbisForRepository = new List<ScrumHubBackend.DatabaseModel.BacklogItem>
        {
            new ScrumHubBackend.DatabaseModel.BacklogItem()
            {
                Id = 1,
                SprintId = 10,
            },
            new ScrumHubBackend.DatabaseModel.BacklogItem()
            {
                Id = 2,
                SprintId = 10,
            },
            new ScrumHubBackend.DatabaseModel.BacklogItem()
            {
                Id = 3,
                SprintId = 20,
            },
            new ScrumHubBackend.DatabaseModel.BacklogItem()
            {
                Id = 4,
                SprintId = 20,
            },
            new ScrumHubBackend.DatabaseModel.BacklogItem()
            {
                Id = 5,
                SprintId = 10,
            },
        };

        [Fact]
        public void GetPBIsForSprint_Should_ReturnProperPBIs()
        {
            var sprint10 = new ScrumHubBackend.DatabaseModel.Sprint()
            {
                SprintNumber = 10,
            };

            var sprint20 = new ScrumHubBackend.DatabaseModel.Sprint()
            {
                SprintNumber = 20,
            };

            var pbis10 = sprint10.GetPBIsForSprint(pbisForRepository).Select(pbi => pbi.Id);
            var pbis20 = sprint20.GetPBIsForSprint(pbisForRepository).Select(pbi => pbi.Id);

            Assert.Contains(1, pbis10);
            Assert.Contains(2, pbis10);
            Assert.Contains(5, pbis10);
            Assert.Contains(3, pbis20);
            Assert.Contains(4, pbis20);
        }
    }
}
