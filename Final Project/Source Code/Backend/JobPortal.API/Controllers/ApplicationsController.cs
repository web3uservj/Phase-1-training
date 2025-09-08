using JobPortal.Core.DTOs;
using JobPortal.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationService _applicationService;

        public ApplicationsController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        /// <summary>
        /// Get application by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApplicationDto>> GetApplicationById(int id)
        {
            var application = await _applicationService.GetApplicationByIdAsync(id);

            if (application == null)
                return NotFound(new { message = "Application not found" });

            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            // Check authorization
            if (userRole != "Admin" &&
                userRole != "Employer" &&
                application.ApplicantId != userId)
            {
                return Forbid("You can only view your own applications");
            }

            return Ok(application);
        }

        /// <summary>
        /// Get applications for a specific job (Employer only)
        /// </summary>
        [HttpGet("job/{jobId}")]
        [Authorize(Roles = "Employer,Admin")]
        public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetApplicationsByJob(int jobId)
        {
            var applications = await _applicationService.GetApplicationsByJobAsync(jobId);
            return Ok(applications);
        }

        /// <summary>
        /// Get current user's applications (Job Seeker)
        /// </summary>
        [HttpGet("my-applications")]
        [Authorize(Roles = "JobSeeker")]
        public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetMyApplications()
        {
            var userId = GetCurrentUserId();
            var applications = await _applicationService.GetApplicationsByApplicantAsync(userId);
            return Ok(applications);
        }

        /// <summary>
        /// Apply for a job
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "JobSeeker")]
        public async Task<ActionResult<ApplicationDto>> CreateApplication([FromBody] CreateApplicationDto createDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var application = await _applicationService.CreateApplicationAsync(userId, createDto);
                return CreatedAtAction(nameof(GetApplicationById), new { id = application.Id }, application);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Update application status (Employer only)
        /// </summary>
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Employer")]
        public async Task<ActionResult<ApplicationDto>> UpdateApplicationStatus(int id, [FromBody] UpdateApplicationStatusDto updateDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var application = await _applicationService.UpdateApplicationStatusAsync(id, userId, updateDto);
                return Ok(application);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        /// <summary>
        /// Delete application (Job Seeker only - their own applications)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "JobSeeker")]
        public async Task<IActionResult> DeleteApplication(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _applicationService.DeleteApplicationAsync(id, userId);

                if (!result)
                    return NotFound(new { message = "Application not found" });

                return Ok(new { message = "Application deleted successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        /// <summary>
        /// Check if user has applied for a job
        /// </summary>
        [HttpGet("check/{jobId}")]
        [Authorize(Roles = "JobSeeker")]
        public async Task<ActionResult<bool>> HasApplied(int jobId)
        {
            var userId = GetCurrentUserId();
            var hasApplied = await _applicationService.HasAppliedAsync(jobId, userId);
            return Ok(new { hasApplied });
        }

        /// <summary>
        /// Get application count for a job (Employer only)
        /// </summary>
        [HttpGet("job/{jobId}/count")]
        [Authorize(Roles = "Employer,Admin")]
        public async Task<ActionResult<int>> GetApplicationCountByJob(int jobId)
        {
            var count = await _applicationService.GetApplicationCountByJobAsync(jobId);
            return Ok(new { applicationCount = count });
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("userId")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        private string GetCurrentUserRole()
        {
            return User.FindFirst(ClaimTypes.Role)?.Value ?? User.FindFirst("role")?.Value ?? "";
        }
        /// <summary>
/// Get all applications for jobs posted by the current employer
/// </summary>
[HttpGet("employer")]
[Authorize(Roles = "Employer,Admin")]
public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetAllApplicationsForEmployer()
{
    var userId = GetCurrentUserId();
    var applications = await _applicationService.GetApplicationsForEmployerAsync(userId);
    return Ok(applications);
}

    }
}
