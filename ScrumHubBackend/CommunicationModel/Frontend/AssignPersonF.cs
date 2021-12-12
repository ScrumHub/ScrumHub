﻿namespace ScrumHubBackend.CommunicationModel.Frontend
{
    /// <summary>
    /// Login of a person to assign or unassign to the task
    /// </summary>
    public class AssignPersonF
    {
        /// <summary>
        /// Login of the person
        /// </summary>
        public string Login { get; set; } = string.Empty;
    }
}
