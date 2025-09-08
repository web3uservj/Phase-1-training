using System.ComponentModel.DataAnnotations;

namespace JobPortal.Core.Entities
{
    public class Company
    {
        public int Id { get; set; }
        
        public int UserId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; }
        
        [StringLength(1000)]
        public string? Description { get; set; }
        
        [StringLength(100)]
        public string? Industry { get; set; }
        
        [StringLength(200)]
        public string? Location { get; set; }
        
        [StringLength(255)]
        public string? Website { get; set; }
        
        public string? LogoFileName { get; set; }
        
        public string? LogoFilePath { get; set; }
        
        public int? EmployeeCount { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation Properties
        public User User { get; set; }
        public ICollection<Job> Jobs { get; set; } = new List<Job>();
    }
}
