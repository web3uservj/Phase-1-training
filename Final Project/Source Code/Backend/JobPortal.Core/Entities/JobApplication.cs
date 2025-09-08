using System.ComponentModel.DataAnnotations;

namespace JobPortal.Core.Entities
{
    public class JobApplication
    {
        public int Id { get; set; }
        
        public int JobId { get; set; }
        
        public int ApplicantId { get; set; }
        
        [StringLength(1000)]
        public string? CoverLetter { get; set; }
        
        [Required]
        public ApplicationStatus Status { get; set; } = ApplicationStatus.Applied;
        
        public DateTime AppliedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? ReviewedDate { get; set; }
        
        public string? ReviewNotes { get; set; }
        
        public DateTime? InterviewDate { get; set; }
        
        public string? InterviewNotes { get; set; }
        
        // Navigation Properties
        public Job Job { get; set; }
        public User Applicant { get; set; }
    }
    
    public enum ApplicationStatus
    {
        Applied = 1,
        UnderReview = 2,
        Shortlisted = 3,
        InterviewScheduled = 4,
        Interviewed = 5,
        Rejected = 6,
        Hired = 7
    }
}
