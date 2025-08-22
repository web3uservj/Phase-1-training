using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Miniproject.Models
{
    public class BankAccount
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        public string AccountNumber { get; set; }

        [Required]
        public double Amount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

       
        [ForeignKey("Customer")]
        public int CustomerId { get; set; }

        // Navigation property
        public Customer Customer { get; set; }
    }
}
