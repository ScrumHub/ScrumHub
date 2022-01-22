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
        /// <example>Sprint view consists of sprint list. Then in each element we should see all PBIs together with assigned tasks.</example>
        public string Goal { get; set; } = String.Empty;

        /// <summary>
        /// Ids of PBIs in the sprint
        /// </summary>
        /// <example>[1, 2, 4]</example>
        public List<long> PBIs { get; set; } = new List<long>();

        /// <summary>
        /// Title of the sprint
        /// </summary>
        /// <example>Make sprint view</example>
        public string Title { get; set; } = String.Empty;

        /// <summary>
        /// Finish date of the sprint
        /// </summary>
        /// <example>2022-01-22T10:17:34.147Z</example>
        public DateTime FinishDate { get; set; }
    }

}
