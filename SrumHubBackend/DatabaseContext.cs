using Microsoft.EntityFrameworkCore;
using ScrumHubBackend.DatabaseModel;

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
        /// Construtor
        /// </summary>
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) 
        {
            Database.EnsureCreated();
        }

    }
}
