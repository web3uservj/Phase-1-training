using System.ComponentModel.DataAnnotations;

namespace JobPortal.Core.Entities
{
    public class JobSeekerProfile
    {
        public int Id { get; set; }
        
        public int UserId { get; set; }
        
        [StringLength(500)]
        public string? Summary { get; set; }
        
        [StringLength(200)]
        public string? Skills { get; set; }
        
        [StringLength(200)]
        public string? Education { get; set; }
        
        [StringLength(500)]
        public string? Experience { get; set; }
        
        public string? ResumeFileName { get; set; }
        
        public string? ResumeFilePath { get; set; }
        
        [StringLength(100)]
        public string? Location { get; set; }
        
        public decimal? ExpectedSalary { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation Properties
        public User User { get; set; }
    }
}
