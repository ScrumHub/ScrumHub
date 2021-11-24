using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScrumHubBackend.DatabaseModel
{
    /// <summary>
    /// Represents one acceptance criterium
    /// </summary>
    [Table("acceptance_criterium")]
    public class AcceptanceCriterium
    {

        /// <summary>
        /// Internal id of criterium
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        /// <summary>
        /// Criterium text
        /// </summary>
        [Required]
        public string Text { get; set; } = String.Empty;

        /// <summary>
        /// Id of a PBI where AC is
        /// </summary>
        public long? BacklogItemId { get; set; } = null;

        /// <summary>
        /// Constructor
        /// </summary>
        public AcceptanceCriterium() { }

        /// <summary>
        /// Constructor
        /// </summary>
        public AcceptanceCriterium(string criterium, long pbiId)
        {
            Text = criterium;
            BacklogItemId = pbiId;
        }
    }
}
