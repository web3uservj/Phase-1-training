using JobPortal.Core.Entities;
using System.ComponentModel.DataAnnotations;

namespace JobPortal.Core.DTOs
{
    public class CreateApplicationDto
    {
        [Required]
        public int JobId { get; set; }
        
        [StringLength(1000)]
        public string? CoverLetter { get; set; }
    }
    
    public class ApplicationDto
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public string JobTitle { get; set; }
        public string CompanyName { get; set; }
        public int ApplicantId { get; set; }
        public string ApplicantName { get; set; }
        public string ApplicantEmail { get; set; }
        public string? CoverLetter { get; set; }
        public ApplicationStatus Status { get; set; }
        public DateTime AppliedDate { get; set; }
        public DateTime? ReviewedDate { get; set; }
        public string? ReviewNotes { get; set; }
        public DateTime? InterviewDate { get; set; }
        public string? InterviewNotes { get; set; }
    }
    
    public class UpdateApplicationStatusDto
    {
        [Required]
        public ApplicationStatus Status { get; set; }
        
        public string? ReviewNotes { get; set; }
        
        public DateTime? InterviewDate { get; set; }
        
        public string? InterviewNotes { get; set; }
    }
}
