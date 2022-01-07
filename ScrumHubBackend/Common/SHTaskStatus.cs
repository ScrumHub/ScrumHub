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
        Finished
    }
}
