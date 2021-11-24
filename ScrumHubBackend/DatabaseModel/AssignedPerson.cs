using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScrumHubBackend.DatabaseModel
{
    /// <summary>
    /// Represents person assigned to the task
    /// </summary>
    [Table("assigned_person")]
    public class AssignedPerson
    {
        /// <summary>
        /// Internal id of an assignment
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        /// <summary>
        /// Id of a person
        /// </summary>
        [Required]
        public long PersonGitHubId { get; set; } = 0;

        /// <summary>
        /// Constructor
        /// </summary>
        public AssignedPerson() { }

        /// <summary>
        /// Constructor
        /// </summary>
        public AssignedPerson(long personGitHubId)
        {
            PersonGitHubId = personGitHubId;
        }
    }
}
