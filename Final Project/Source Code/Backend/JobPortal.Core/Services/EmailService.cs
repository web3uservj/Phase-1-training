using JobPortal.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Mail;

namespace JobPortal.Core.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;
        private readonly SmtpClient _smtpClient;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
            
            var smtpSettings = _configuration.GetSection("SmtpSettings");
            _smtpClient = new SmtpClient(smtpSettings["Host"])
            {
                Port = int.Parse(smtpSettings["Port"] ?? "587"),
                Credentials = new NetworkCredential(
                    smtpSettings["Username"], 
                    smtpSettings["Password"]),
                EnableSsl = bool.Parse(smtpSettings["EnableSsl"] ?? "true")
            };
        }

        public async Task SendWelcomeEmailAsync(string email, string firstName)
        {
            var subject = "Welcome to Job Portal!";
            var body = $@"
                <html>
                <body>
                    <h2>Welcome to Job Portal, {firstName}!</h2>
                    <p>Thank you for joining our platform. We're excited to help you in your career journey.</p>
                    <p>You can now:</p>
                    <ul>
                        <li>Browse thousands of job opportunities</li>
                        <li>Create and manage your professional profile</li>
                        <li>Apply to jobs that match your skills</li>
                        <li>Track your application status</li>
                    </ul>
                    <p>Best regards,<br>The Job Portal Team</p>
                </body>
                </html>";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendApplicationConfirmationAsync(string applicantEmail, string jobTitle, string companyName)
        {
            var subject = "Application Submitted Successfully";
            var body = $@"
                <html>
                <body>
                    <h2>Application Confirmation</h2>
                    <p>Your application for the position of <strong>{jobTitle}</strong> at <strong>{companyName}</strong> has been submitted successfully.</p>
                    <p>We will notify you of any updates regarding your application status.</p>
                    <p>Good luck!</p>
                    <p>Best regards,<br>The Job Portal Team</p>
                </body>
                </html>";

            await SendEmailAsync(applicantEmail, subject, body);
        }

        public async Task SendApplicationStatusUpdateAsync(string applicantEmail, string jobTitle, string status, string? notes = null)
        {
            var subject = $"Application Status Update - {jobTitle}";
            var body = $@"
                <html>
                <body>
                    <h2>Application Status Update</h2>
                    <p>Your application for <strong>{jobTitle}</strong> has been updated.</p>
                    <p><strong>New Status:</strong> {status}</p>
                    {(string.IsNullOrEmpty(notes) ? "" : $"<p><strong>Notes:</strong> {notes}</p>")}
                    <p>You can check your application status anytime by logging into your account.</p>
                    <p>Best regards,<br>The Job Portal Team</p>
                </body>
                </html>";

            await SendEmailAsync(applicantEmail, subject, body);
        }

        public async Task SendInterviewScheduledAsync(string applicantEmail, string jobTitle, DateTime interviewDate, string? notes = null)
        {
            var subject = $"Interview Scheduled - {jobTitle}";
            var body = $@"
                <html>
                <body>
                    <h2>Interview Scheduled</h2>
                    <p>Congratulations! An interview has been scheduled for your application to <strong>{jobTitle}</strong>.</p>
                    <p><strong>Interview Date:</strong> {interviewDate:dddd, MMMM dd, yyyy 'at' h:mm tt}</p>
                    {(string.IsNullOrEmpty(notes) ? "" : $"<p><strong>Additional Information:</strong> {notes}</p>")}
                    <p>Please make sure to be prepared and arrive on time.</p>
                    <p>Good luck with your interview!</p>
                    <p>Best regards,<br>The Job Portal Team</p>
                </body>
                </html>";

            await SendEmailAsync(applicantEmail, subject, body);
        }

        public async Task SendJobPostedConfirmationAsync(string employerEmail, string jobTitle)
        {
            var subject = "Job Posted Successfully";
            var body = $@"
                <html>
                <body>
                    <h2>Job Posted Successfully</h2>
                    <p>Your job posting for <strong>{jobTitle}</strong> has been published successfully.</p>
                    <p>Your job is now visible to job seekers on our platform. You will receive notifications when candidates apply.</p>
                    <p>You can manage your job postings and review applications from your employer dashboard.</p>
                    <p>Best regards,<br>The Job Portal Team</p>
                </body>
                </html>";

            await SendEmailAsync(employerEmail, subject, body);
        }

        public async Task SendNewApplicationNotificationAsync(string employerEmail, string jobTitle, string applicantName)
        {
            var subject = $"New Application Received - {jobTitle}";
            var body = $@"
                <html>
                <body>
                    <h2>New Application Received</h2>
                    <p>You have received a new application for your job posting: <strong>{jobTitle}</strong></p>
                    <p><strong>Applicant:</strong> {applicantName}</p>
                    <p>Please log into your employer dashboard to review the application and candidate profile.</p>
                    <p>Best regards,<br>The Job Portal Team</p>
                </body>
                </html>";

            await SendEmailAsync(employerEmail, subject, body);
        }

        public async Task SendBulkEmailAsync(List<string> emails, string subject, string body)
        {
            var tasks = emails.Select(email => SendEmailAsync(email, subject, body));
            await Task.WhenAll(tasks);
        }

        private async Task SendEmailAsync(string email, string subject, string body)
        {
            try
            {
                var fromEmail = _configuration["SmtpSettings:FromEmail"] ?? "noreply@jobportal.com";
                var fromName = _configuration["SmtpSettings:FromName"] ?? "Job Portal";

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail, fromName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(email);

                await _smtpClient.SendMailAsync(mailMessage);
                _logger.LogInformation($"Email sent successfully to {email}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {email}");
                throw;
            }
        }

        public void Dispose()
        {
            _smtpClient?.Dispose();
        }
    }
}
