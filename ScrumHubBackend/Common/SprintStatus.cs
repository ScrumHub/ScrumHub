namespace ScrumHubBackend.Common
{
    /// <summary>
    /// Status of the sprint
    /// </summary>
    public enum SprintStatus
    {
        /// <summary>
        /// Sprint that is not finished yet
        /// </summary>
        NotFinished,

        /// <summary>
        /// Sprint marked as failed
        /// </summary>
        Failed,

        /// <summary>
        /// Sprint marked as success
        /// </summary>
        Successful
    }
}
