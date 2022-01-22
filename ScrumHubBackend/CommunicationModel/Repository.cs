using System.Collections.ObjectModel;

namespace ScrumHubBackend.CommunicationModel
{
    /// <summary>
    /// Represents repository
    /// </summary>
    public class Repository
    {
        private const string noRecentActivity = "No recent activity";

        private static ReadOnlyDictionary<string, string> eventTypeToReadableString = new(new Dictionary<string, string>
        {
            ["CommitCommentEvent"] = "Commit comment created",
            ["CreateEvent"] = "Branch or tag created",
            ["DeleteEvent"] = "Branch or tag deleted",
            ["ForkEvent"] = "Repository forked",
            ["GollumEvent"] = "Wiki page created or updated",
            ["IssueCommentEvent"] = "Issue or pull request comment action",
            ["IssuesEvent"] = "Issue action",
            ["MemberEvent"] = "Collabolators related action",
            ["PublicEvent"] = "Repository changed from private to public, \"Without a doubt: the best GitHub event.\"",
            ["PullRequestEvent"] = "Pull request action",
            ["PullRequestReviewEvent"] = "Pull request review action",
            ["PullRequestReviewCommentEvent"] = "Pull request review comment action",
            ["PushEvent"] = "Commits pushed to a branch or tag",
            ["ReleaseEvent"] = "Release action",
            ["SponsorshipEvent"] = "Sponsorship action",
            ["WatchEvent"] = "Starring action",
        });
        /// <summary>
        /// Name of repository
        /// </summary>
        /// <example>ScrumHub/ScrumHub</example>
        public string? Name { get; set; } = String.Empty;

        /// <summary>
        /// Description of the repository
        /// </summary>
        /// <example>Agile development platform integrated with GitHub.</example>
        public string? Description { get; set; } = String.Empty;

        /// <summary>
        /// Date of last user activity in format "yyyy-MM-dd HH:mm:ss 'UTC'" or "No recent activity"
        /// </summary>
        /// <example>2022-01-22 10:05:11 UTC</example>
        public string? DateOfLastActivity { get; set; } = String.Empty;

        /// <summary>
        /// Type of last user activity or "No recent activity"
        /// </summary>
        /// <example>Branch or tag created</example>
        public string? TypeOfLastActivity { get; set; } = String.Empty;

        /// <summary>
        /// GitHub id of repository
        /// </summary>
        /// <example>425815732</example>
        public long GitHubId { get; set; } = 0;

        /// <summary>
        /// Does current user have admin rights to the repository
        /// </summary>
        /// <example>true</example>
        public bool HasAdminRights { get; set; } = false;

        /// <summary>
        /// Is this repository already in ScrumHub
        /// </summary>
        /// <example>true</example>
        public bool AlreadyInScrumHub { get; set; } = false;

        /// <summary>
        /// List of ids of backlog items
        /// </summary>
        /// <example>[1, 2, 9, 12, 18, 22]</example>
        public List<long> BacklogItems { get; set; } = new List<long>();

        /// <summary>
        /// List of numbers of sprints
        /// </summary>
        /// <example>[1, 2, 4, 5]</example>
        public List<long> Sprints { get; set; } = new List<long>();

        /// <summary>
        /// Constructor
        /// </summary>
        public Repository() { }

        /// <summary>
        /// Constructor
        /// </summary>
        public Repository(Octokit.Repository repository, IEnumerable<Octokit.Activity> repoActivities, DatabaseContext dbContext)
        {
            Name = repository.FullName;
            Description = repository.Description;
            var lastActivity = repoActivities.FirstOrDefault();
            DateOfLastActivity = lastActivity?.CreatedAt.UtcDateTime.ToString("yyyy-MM-dd HH:mm:ss 'UTC'") ?? noRecentActivity;
            TypeOfLastActivity = lastActivity == null ? noRecentActivity : eventTypeToReadableString.GetValueOrDefault(lastActivity.Type) ?? "Unknown action";
            GitHubId = repository.Id;
            HasAdminRights = repository.Permissions.Admin == true;
            DatabaseModel.Repository? dbRepository = 
                dbContext.Repositories?.FirstOrDefault(internalRepository => internalRepository.GitHubId == GitHubId);

            if (dbRepository == null)
            {
                AlreadyInScrumHub = false;
                return;
            }

            AlreadyInScrumHub = true;
            BacklogItems = dbContext.BacklogItems?.Where(pbi => pbi.RepositoryId == dbRepository.Id).Select(dbPbi => dbPbi.Id).ToList() ?? new List<long>();
            Sprints = dbContext.Sprints?.Where(sprint => sprint.RepositoryId == dbRepository.Id).Select(sprint => sprint.SprintNumber).ToList() ?? new List<long>();
        }
    }
}
