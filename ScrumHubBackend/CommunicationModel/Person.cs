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
        /// <example>Jack Example</example>
        public string? Name { get; set; } = String.Empty;

        /// <summary>
        /// Login of person
        /// </summary>
        /// <example>jckex9912</example>
        public string? Login { get; set; } = String.Empty;

        /// <summary>
        /// GitHub id of person
        /// </summary>
        /// <example>718221</example>
        public long GitHubId { get; set; } = 0;

        /// <summary>
        /// Link to the avatar of the person
        /// </summary>
        /// <example>https://avatars.githubusercontent.com/u/27913213?v=4</example>
        public string? AvatarLink { get; set; } = String.Empty;

        /// <summary>
        /// True if this person is the current user
        /// </summary>
        /// <example>false</example>
        public bool IsCurrentUser { get; set; } = false;

        /// <summary>
        /// Constructor
        /// </summary>
        public Person(Octokit.User user, long currentUserId)
        {
            Name = user.Name;
            Login = user.Login;
            GitHubId = user.Id;
            AvatarLink = user.AvatarUrl;
            IsCurrentUser = user.Id == currentUserId;
        }
    }
}
