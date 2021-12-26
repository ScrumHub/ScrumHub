namespace ScrumHubBackend.CommunicationModel.Frontend
{
    /// <summary>
    /// Represents single sprint
    /// </summary>
    public class SprintF
    {
        /// <summary>
        /// Goal of the sprint
        /// </summary>
        public string Goal { get; set; } = String.Empty;

        /// <summary>
        /// Ids of PBIs in the sprint
        /// </summary>
        public List<long> PBIs { get; set; } = new List<long>();

        /// <summary>
        /// Title of the sprint
        /// </summary>
        public string Title { get; set; } = String.Empty;

        /// <summary>
        /// Finish date of the sprint
        /// </summary>
        public DateTime FinishDate { get; set; }
    }

}
