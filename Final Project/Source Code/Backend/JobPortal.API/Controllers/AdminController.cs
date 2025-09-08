using JobPortal.Core.DTOs;
using JobPortal.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        /// <summary>
        /// Get dashboard statistics
        /// </summary>
        [HttpGet("dashboard")]
        public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
        {
            var stats = await _adminService.GetDashboardStatsAsync();
            return Ok(stats);
        }

        /// <summary>
        /// Get all users for management
        /// </summary>
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserManagementDto>>> GetAllUsersForManagement()
        {
            var users = await _adminService.GetAllUsersForManagementAsync();
            return Ok(users);
        }

      
        [HttpPut("users/{userId}/status")]
        public async Task<ActionResult<UserManagementDto>> UpdateUserStatus(int userId, [FromBody] UpdateUserStatusDto updateDto)
        {
            try
            {
                var user = await _adminService.UpdateUserStatusAsync(userId, updateDto);
                return Ok(user);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        
        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var result = await _adminService.DeleteUserAsync(userId);
            
            if (!result)
                return NotFound(new { message = "User not found" });

            return Ok(new { message = "User deleted successfully" });
        }

       
        [HttpGet("jobs/moderation")]
        public async Task<ActionResult<IEnumerable<JobModerationDto>>> GetJobsForModeration()
        {
            var jobs = await _adminService.GetJobsForModerationAsync();
            return Ok(jobs);
        }

       
        [HttpPost("jobs/{jobId}/approve")]
        public async Task<IActionResult> ApproveJob(int jobId)
        {
            var result = await _adminService.ApproveJobAsync(jobId);
            
            if (!result)
                return NotFound(new { message = "Job not found" });

            return Ok(new { message = "Job approved successfully" });
        }

        /// <summary>
        /// Reject job posting
        /// </summary>
        [HttpPost("jobs/{jobId}/reject")]
        public async Task<IActionResult> RejectJob(int jobId, [FromBody] string reason)
        {
            var result = await _adminService.RejectJobAsync(jobId, reason);
            
            if (!result)
                return NotFound(new { message = "Job not found" });

            return Ok(new { message = "Job rejected successfully" });
        }

        /// <summary>
        /// Generate user report
        /// </summary>
        [HttpGet("reports/users")]
        public async Task<ActionResult<ReportDto>> GenerateUserReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            if (startDate == default || endDate == default)
            {
                return BadRequest(new { message = "Start date and end date are required" });
            }

            var report = await _adminService.GenerateUserReportAsync(startDate, endDate);
            return Ok(report);
        }

        /// <summary>
        /// Generate job report
        /// </summary>
        [HttpGet("reports/jobs")]
        public async Task<ActionResult<ReportDto>> GenerateJobReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            if (startDate == default || endDate == default)
            {
                return BadRequest(new { message = "Start date and end date are required" });
            }

            var report = await _adminService.GenerateJobReportAsync(startDate, endDate);
            return Ok(report);
        }

        /// <summary>
        /// Generate application report
        /// </summary>
        [HttpGet("reports/applications")]
        public async Task<ActionResult<ReportDto>> GenerateApplicationReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            if (startDate == default || endDate == default)
            {
                return BadRequest(new { message = "Start date and end date are required" });
            }

            var report = await _adminService.GenerateApplicationReportAsync(startDate, endDate);
            return Ok(report);
        }

        /// <summary>
        /// Get system activity logs
        /// </summary>
        [HttpGet("activity")]
        public async Task<ActionResult<IEnumerable<SystemActivityDto>>> GetSystemActivity([FromQuery] int days = 30)
        {
            if (days < 1 || days > 365)
            {
                return BadRequest(new { message = "Days must be between 1 and 365" });
            }

            var activities = await _adminService.GetSystemActivityAsync(days);
            return Ok(activities);
        }

        /// <summary>
        /// Get system health status
        /// </summary>
        [HttpGet("health")]
        public async Task<ActionResult> GetSystemHealth()
        {
            var stats = await _adminService.GetDashboardStatsAsync();
            
            var health = new
            {
                Status = "Healthy",
                Timestamp = DateTime.UtcNow,
                Metrics = new
                {
                    TotalUsers = stats.TotalUsers,
                    ActiveJobs = stats.ActiveJobs,
                    TotalApplications = stats.TotalApplications,
                    ApplicationSuccessRate = stats.ApplicationSuccessRate
                },
                Services = new
                {
                    Database = "Connected",
                    Authentication = "Active",
                    FileStorage = "Available"
                }
            };

            return Ok(health);
        }
    }
}
