using Microsoft.EntityFrameworkCore;
using ScrumHubBackend.DatabaseModel;
using SHTask = ScrumHubBackend.DatabaseModel.SHTask;

namespace ScrumHubBackend
{
    /// <summary>
    /// Database Context
    /// </summary>
    public class DatabaseContext : DbContext
    {
        private ILogger<DatabaseContext>? _logger;

        /// <summary>
        /// Repositories in ScrumHub
        /// </summary>
        public virtual DbSet<Repository>? Repositories { get; set; }

        /// <summary>
        /// All PBIs in ScrumHub
        /// </summary>
        public virtual DbSet<BacklogItem>? BacklogItems { get; set; }

        /// <summary>
        /// All acceptance criteria in ScrumHub
        /// </summary>
        public virtual DbSet<AcceptanceCriterium>? AcceptanceCriteria { get; set; }

        /// <summary>
        /// All tasks in ScrumHub
        /// </summary>
        public virtual DbSet<SHTask>? Tasks { get; set; }

        /// <summary>
        /// All sprints in ScrumHub
        /// </summary>
        public virtual DbSet<Sprint>? Sprints { get; set; }

        /// <summary>
        /// Relation describing people assigned to tasks
        /// </summary>
        public virtual DbSet<AssignedPerson>? AssignedPeople { get; set; }

        /// <summary>
        /// Construtor
        /// </summary>
        public DatabaseContext(DbContextOptions<DatabaseContext> options, ILogger<DatabaseContext> logger) : base(options) 
        {
            _logger = logger;
            Database.EnsureCreated();
        }

        /// <summary>
        /// Constructor for tests
        /// </summary>
        public DatabaseContext() : base() { }

    }
}
