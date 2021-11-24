using Microsoft.EntityFrameworkCore;
using ScrumHubBackend.DatabaseModel;
using Task = ScrumHubBackend.DatabaseModel.Task;

namespace ScrumHubBackend
{
    /// <summary>
    /// Database Context
    /// </summary>
    public class DatabaseContext : DbContext
    {
        /// <summary>
        /// Repositories in ScrumHub
        /// </summary>
        public DbSet<Repository>? Repositories { get; set; }

        /// <summary>
        /// All PBIs in ScrumHub
        /// </summary>
        public DbSet<BacklogItem>? BacklogItems { get; set; }

        /// <summary>
        /// All acceptance criteria in ScrumHub
        /// </summary>
        public DbSet<AcceptanceCriterium>? AcceptanceCriteria { get; set; }

        /// <summary>
        /// All tasks in ScrumHub
        /// </summary>
        public DbSet<Task>? Tasks { get; set; }

        /// <summary>
        /// All sprints in ScrumHub
        /// </summary>
        public DbSet<Sprint>? Sprints { get; set; }

        /// <summary>
        /// Relation describing people assigned to tasks
        /// </summary>
        public DbSet<AssignedPerson>? AssignedPeople { get; set; }

        /// <summary>
        /// Construtor
        /// </summary>
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) 
        {
            Database.EnsureCreated();
        }

    }
}
