using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Miniproject.Models
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        public int Age { get; set; }

        // Navigation property
        [JsonIgnore]
        public ICollection<BankAccount> BankAccounts { get; set; }
    }
}
