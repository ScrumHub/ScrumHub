using MediatR;
using Octokit;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;

namespace ScrumHubBackend.CQRS.Tasks
{
    /// <summary>
    /// Command for filling list of PBIs from given repository with tasks
    /// <para>I has no seurity checks with assumption that it is called from another already checked handler</para>
    /// <para>Returns dictionay from PBI id (from passed list) to ienumerable of tasks that should be added to the PBI</para>
    /// </summary>
    public class FillPBIsWithTasksCommand : IRequest<Dictionary<long, IEnumerable<SHTask>>>
    {
        /// <summary>
        /// GitHub client
        /// </summary>
        public IGitHubClient? GitHubClient { get; set; }
        /// <summary>
        /// Repository where pbis are
        /// </summary>
        public Octokit.Repository? Repository { get; set; }
        /// <summary>
        /// Database repository corresponding to GitHub repository
        /// </summary>
        public DatabaseModel.Repository? DbRepository { get; set; }
        /// <summary>
        /// PBIs to attach tasks to
        /// </summary>
        public IEnumerable<BacklogItem>? BacklogItems { get; set; }
    }
}
