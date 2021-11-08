using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScrumHubBackend.DatabaseModel
{
    /// <summary>
    /// Represents repository already transformed to ScrumHub
    /// </summary>
    [Table("Repository")]
    public class Repository
    {
        /// <summary>
        /// Internal id of repository
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        /// <summary>
        /// GitHub id of repository
        /// </summary>
        [Required]
        public long GitHubId { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        public Repository() { }

        /// <summary>
        /// Constructor
        /// </summary>
        public Repository(Octokit.Repository repository)
        {
            GitHubId = repository.Id;
        }
    }
}
