using System.ComponentModel.DataAnnotations;

namespace JobPortal.Core.Entities
{
    public class Job
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; }
        
        [Required]
        public string Description { get; set; }
        
        [Required]
        public string Requirements { get; set; }
        
        [StringLength(100)]
        public string? Location { get; set; }
        
        public decimal? MinSalary { get; set; }
        
        public decimal? MaxSalary { get; set; }
        
        [Required]
        public JobType JobType { get; set; }
        
        [Required]
        public ExperienceLevel ExperienceLevel { get; set; }
        
        [StringLength(100)]
        public string? Category { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime PostedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? ApplicationDeadline { get; set; }
        
        public int PostedByUserId { get; set; }
        
        public int CompanyId { get; set; }
        
        // Navigation Properties
        public User PostedBy { get; set; }
        public Company Company { get; set; }
        public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
    }
    
    public enum JobType
    {
        FullTime = 1,
        PartTime = 2,
        Contract = 3,
        Internship = 4,
        Remote = 5
    }
    
    public enum ExperienceLevel
    {
        EntryLevel = 1,
        MidLevel = 2,
        SeniorLevel = 3,
        Executive = 4
    }
}
