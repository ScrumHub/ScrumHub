﻿using MediatR;
using Octokit;
using ScrumHubBackend.Common;
using ScrumHubBackend.CQRS;
using ScrumHubBackend.CQRS.Tasks;

namespace ScrumHubBackend.CommunicationModel
{
    /// <summary>
    /// Represents a sprint
    /// </summary>
    public class Sprint
    {
        /// <summary>
        /// Number of a sprint in the project
        /// </summary>
        public long SprintNumber { get; set; }

        /// <summary>
        /// Title of the sprint
        /// </summary>
        public string Title { get; set; } = String.Empty;

        /// <summary>
        /// Goal of the sprint
        /// </summary>
        public string Goal { get; set; } = String.Empty;

        /// <summary>
        /// PBI that will be done in this sprint
        /// </summary>
        public ICollection<BacklogItem>? BacklogItems { get; set; } = null;

        /// <summary>
        /// in format "yyyy-MM-dd 'UTC'"
        /// </summary>
        public string FinishDate { get; set; } = String.Empty;

        /// <summary>
        /// True if actual sprint is current (the one with the earliest not passed finish date)
        /// </summary>
        public bool IsCurrent { get; set; } = false;

        /// <summary>
        /// Status of the sprint
        /// </summary>
        public SprintStatus Status { get; set; } = SprintStatus.NotFinished;

        /// <summary>
        /// Flag if sprint is completed
        /// </summary>
        public bool IsCompleted { get => Status != SprintStatus.NotFinished; }

        /// <summary>
        /// Constructor
        /// </summary>
        public Sprint() { }

        /// <summary>
        /// Constructor
        /// </summary>
        public Sprint(DatabaseModel.Sprint dbSprint, IGitHubClient gitHubClient, Octokit.Repository repository, DatabaseModel.Repository dbRepository, ICommonInRepositoryRequest originalRequest, DatabaseContext dbContext, IMediator mediator, bool fillTasks)
        {
            SprintNumber = dbSprint.SprintNumber;
            Goal = dbSprint.Goal;
            FinishDate = dbSprint.FinishDate.ToString("yyyy-MM-dd 'UTC'");
            Title = dbSprint.Title;
            Status = dbSprint.Status;

            var relatedDbBacklogItem = dbContext.BacklogItems?.Where(pbi => pbi.SprintId == dbSprint.SprintNumber && pbi.RepositoryId == dbSprint.RepositoryId).ToList();
            BacklogItems = relatedDbBacklogItem?.Select(pbi => new BacklogItem(pbi, originalRequest, dbContext, mediator, false)).ToList() ?? new List<BacklogItem>();

            if(fillTasks)
            {
                var fillTasksCommand = new FillPBIsWithTasksCommand()
                {
                    GitHubClient = gitHubClient,
                    Repository = repository,
                    DbRepository = dbRepository,
                    BacklogItems = BacklogItems
                };

                var pbiTasks = mediator.Send(fillTasksCommand).Result;

                foreach (var pbi in BacklogItems)
                {
                    pbi.AddTasks(pbiTasks[pbi.Id]);
                }
            }

            IsCurrent = dbContext.Sprints?
                .Where(
                    sprint => sprint.RepositoryId == dbSprint.RepositoryId &&
                    sprint.FinishDate.Date >= DateTime.UtcNow.Date
                ).OrderBy(sprint => sprint.FinishDate)
                .ThenBy(Sprint => Sprint.SprintNumber)
                .FirstOrDefault()?.SprintNumber.Equals(dbSprint.SprintNumber) ?? false;
        }
    }
}
