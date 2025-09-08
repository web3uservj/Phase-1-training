using JobPortal.Core.DTOs;

namespace JobPortal.Core.Interfaces
{
    public interface IEmailService
    {
        Task SendWelcomeEmailAsync(string email, string firstName);
        Task SendApplicationConfirmationAsync(string applicantEmail, string jobTitle, string companyName);
        Task SendApplicationStatusUpdateAsync(string applicantEmail, string jobTitle, string status, string? notes = null);
        Task SendInterviewScheduledAsync(string applicantEmail, string jobTitle, DateTime interviewDate, string? notes = null);
        Task SendJobPostedConfirmationAsync(string employerEmail, string jobTitle);
        Task SendNewApplicationNotificationAsync(string employerEmail, string jobTitle, string applicantName);
        Task SendBulkEmailAsync(List<string> emails, string subject, string body);
    }
}
