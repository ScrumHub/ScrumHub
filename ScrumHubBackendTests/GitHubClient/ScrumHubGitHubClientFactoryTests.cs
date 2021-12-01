using ScrumHubBackend.GitHubClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace ScrumHubBackendTests.GitHubClient
{
    public class ScrumHubGitHubClientFactoryTests
    {
        private const string authToken = "exampleAuthToken";

        [Fact]
        public void Create_Should_ReturnProperClient()
        {
            var factory = new ScrumHubGitHubClientFactory();
            var client = factory.Create(authToken);

            Assert.True(client.Credentials.AuthenticationType == Octokit.AuthenticationType.Oauth);
        }
    }
}
