using Microsoft.EntityFrameworkCore;
using SrumHubBackend.DatabaseModel;

namespace SrumHubBackend
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
