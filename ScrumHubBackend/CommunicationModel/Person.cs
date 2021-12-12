namespace ScrumHubBackend.CommunicationModel
{
    /// <summary>
    /// Represents person
    /// </summary>
    public class Person
    {
        /// <summary>
        /// Name of person (might be null)
        /// </summary>
        public string? Name { get; set; } = String.Empty;

        /// <summary>
        /// Login of person
        /// </summary>
        public string? Login { get; set; } = String.Empty;

        /// <summary>
        /// GitHub id of person
        /// </summary>
        public long GitHubId { get; set; } = 0;

        /// <summary>
        /// Link to the avatar of the person
        /// </summary>
        public string? AvatarLink { get; set; } = String.Empty;

        /// <summary>
        /// Constructor
        /// </summary>
        public Person(Octokit.User user)
        {
            Name = user.Name;
            Login = user.Login;
            GitHubId = user.Id;
            AvatarLink = user.AvatarUrl;
        }
    }
}
