namespace ScrumHubBackend.GitHubClient
{
    /// <summary>
    /// Factory able to create GitHub clients
    /// </summary>
    public interface IGitHubClientFactory
    {
        /// <summary>
        /// Creates GitHubClient
        /// </summary>
        /// <param name="authToken">Authorization token for requests</param>
        Octokit.GitHubClient Create(string authToken);
    }

    /// <summary>
    /// Factory creating GitHub clients with "ScrumHub" app name
    /// </summary>
    public class ScrumHubGitHubClientFactory : IGitHubClientFactory
    {
        private const string appName = "ScrumHub";

        /// <inheritdoc/>
        public Octokit.GitHubClient Create(string authToken)
        {
            var tokenAuthorization = new Octokit.Credentials(authToken);
            var client = new Octokit.GitHubClient(new Octokit.ProductHeaderValue(appName))
            {
                Credentials = tokenAuthorization
            };
            return client;
        }
    }
}
