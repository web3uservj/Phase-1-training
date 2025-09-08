using JobPortal.Core.Entities;
using System.ComponentModel.DataAnnotations;

namespace JobPortal.Core.DTOs
{
    public class CreateJobDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; }
        
        [Required]
        public string Description { get; set; }
        
        [Required]
        public string Requirements { get; set; }
        
        public string? Location { get; set; }
        
        public decimal? MinSalary { get; set; }
        
        public decimal? MaxSalary { get; set; }
        
        [Required]
        public JobType JobType { get; set; }
        
        [Required]
        public ExperienceLevel ExperienceLevel { get; set; }
        
        public string? Category { get; set; }
        
        public DateTime? ApplicationDeadline { get; set; }
    }
    
    public class JobDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Requirements { get; set; }
        public string? Location { get; set; }
        public decimal? MinSalary { get; set; }
        public decimal? MaxSalary { get; set; }
        public JobType JobType { get; set; }
        public ExperienceLevel ExperienceLevel { get; set; }
        public string? Category { get; set; }
        public bool IsActive { get; set; }
        public DateTime PostedDate { get; set; }
        public DateTime? ApplicationDeadline { get; set; }
        public string CompanyName { get; set; }
        public string CompanyLocation { get; set; }
        public int ApplicationCount { get; set; }
    }
    
    public class JobSearchDto
    {
        public string? Title { get; set; }
        public string? Location { get; set; }
        public string? Category { get; set; }
        public JobType? JobType { get; set; }
        public ExperienceLevel? ExperienceLevel { get; set; }
        public decimal? MinSalary { get; set; }
        public decimal? MaxSalary { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
