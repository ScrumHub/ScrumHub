namespace ScrumHubBackend.Common
{
    /// <summary>
    /// Status of the task
    /// </summary>
    public enum SHTaskStatus
    {
        /// <summary>
        /// New task (default for opened issue)
        /// </summary>
        New,

        /// <summary>
        /// Task in progress, after branch is created in ScrumHub
        /// </summary>
        InProgress,

        /// <summary>
        /// Exist opened PR for branch related to issue
        /// </summary>
        InReview,

        /// <summary>
        /// Finished task, for closed issues
        /// </summary>
        Finished,

        /// <summary>
        /// New task, but matching branch exists in repo
        /// </summary>
        NewWBranch,

        /// <summary>
        /// Task in progress, after branch is created in ScrumHub, but matching branch exists in repo
        /// </summary>
        InProgressWBranch,

        /// <summary>
        /// Exist opened PR for branch related to issue, but matching branch exists in repo
        /// </summary>
        InReviewWBranch,

        /// <summary>
        /// Finished task, for closed issues, but matching branch exists in repo
        /// </summary>
        FinishedWBranch
    }
}
