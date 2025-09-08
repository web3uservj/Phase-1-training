using JobPortal.Core.Entities;

namespace JobPortal.Core.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalUsers { get; set; }
        public int TotalJobSeekers { get; set; }
        public int TotalEmployers { get; set; }
        public int TotalJobs { get; set; }
        public int ActiveJobs { get; set; }
        public int TotalApplications { get; set; }
        public int TotalCompanies { get; set; }
        public decimal ApplicationSuccessRate { get; set; }
        public List<MonthlyStatsDto> MonthlyStats { get; set; } = new();
        public List<JobCategoryStatsDto> JobCategoryStats { get; set; } = new();
        public List<TopCompanyDto> TopCompanies { get; set; } = new();
    }
    
    public class MonthlyStatsDto
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public string MonthName { get; set; }
        public int NewUsers { get; set; }
        public int NewJobs { get; set; }
        public int NewApplications { get; set; }
    }
    
    public class JobCategoryStatsDto
    {
        public string Category { get; set; }
        public int JobCount { get; set; }
        public int ApplicationCount { get; set; }
    }
    
    public class TopCompanyDto
    {
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public int JobCount { get; set; }
        public int ApplicationCount { get; set; }
    }
    
    public class UserManagementDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public UserRole Role { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public int? JobPostCount { get; set; }
        public int? ApplicationCount { get; set; }
        public string? CompanyName { get; set; }
    }
    
    public class UpdateUserStatusDto
    {
        public bool IsActive { get; set; }
        public string? Reason { get; set; }
    }
    
    public class JobModerationDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string CompanyName { get; set; }
        public string PostedByName { get; set; }
        public DateTime PostedDate { get; set; }
        public bool IsActive { get; set; }
        public int ApplicationCount { get; set; }
        public bool RequiresReview { get; set; }
    }
    
    public class ReportDto
    {
        public string ReportType { get; set; }
        public DateTime GeneratedAt { get; set; }
        public Dictionary<string, object> Data { get; set; } = new();
    }
    
    public class SystemActivityDto
    {
        public DateTime Date { get; set; }
        public string ActivityType { get; set; }
        public string Description { get; set; }
        public string UserEmail { get; set; }
        public string UserRole { get; set; }
    }
}
