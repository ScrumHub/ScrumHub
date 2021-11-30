using Microsoft.EntityFrameworkCore;
using Moq;
using ScrumHubBackend;
using ScrumHubBackend.DatabaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace ScrumHubBackendTests.DatabaseModel
{
    public class BacklogItem
    {
        private static readonly List<AcceptanceCriterium> AcceptanceCriterium = new()
        {
            new AcceptanceCriterium()
            {
                Text = "ac1",
                BacklogItemId = 1
            },
            new AcceptanceCriterium()
            {
                Text = "ac2",
                BacklogItemId = 2
            },
            new AcceptanceCriterium()
            {
                Text = "ac3",
                BacklogItemId = 1
            }
        };

        [Fact]
        public void GetAcceptanceCriteriaForPBI_Should_ReturnAcceptanceCriteria()
        {
            var accData = AcceptanceCriterium.AsQueryable();

            var mockAcceptanceCriteriaSet = new Mock<DbSet<AcceptanceCriterium>>();
            mockAcceptanceCriteriaSet.As<IQueryable<AcceptanceCriterium>>().Setup(m => m.Provider).Returns(accData.Provider);
            mockAcceptanceCriteriaSet.As<IQueryable<AcceptanceCriterium>>().Setup(m => m.Expression).Returns(accData.Expression);
            mockAcceptanceCriteriaSet.As<IQueryable<AcceptanceCriterium>>().Setup(m => m.ElementType).Returns(accData.ElementType);
            mockAcceptanceCriteriaSet.As<IQueryable<AcceptanceCriterium>>().Setup(m => m.GetEnumerator()).Returns(accData.GetEnumerator());

            var mockContext = new Mock<DatabaseContext>();
            mockContext.Setup(m => m.AcceptanceCriteria).Returns(mockAcceptanceCriteriaSet.Object);

            var pbi1 = new ScrumHubBackend.DatabaseModel.BacklogItem()
            {
                Id = 1,
            };

            var pbi2 = new ScrumHubBackend.DatabaseModel.BacklogItem()
            {
                Id = 2,
            };

            var criteria1 = pbi1.GetAcceptanceCriteriaForPBI(mockContext.Object).Select(ac => ac.Text);
            var criteria2 = pbi2.GetAcceptanceCriteriaForPBI(mockContext.Object).Select(ac => ac.Text);

            Assert.Contains("ac1", criteria1);
            Assert.Contains("ac3", criteria1);
            Assert.Contains("ac2", criteria2);
        }
    }
}
