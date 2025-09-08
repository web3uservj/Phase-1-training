using JobPortal.Core.DTOs;
using JobPortal.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobsController : ControllerBase
    {
        private readonly IJobService _jobService;

        public JobsController(IJobService jobService)
        {
            _jobService = jobService;
        }

        /// <summary>
        /// Get all active jobs (Public access)
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobDto>>> GetAllJobs()
        {
            var jobs = await _jobService.GetAllJobsAsync();
            return Ok(jobs);
        }

        /// <summary>
        /// Get job by ID (Public access)
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<JobDto>> GetJobById(int id)
        {
            var job = await _jobService.GetJobByIdAsync(id);
            
            if (job == null)
                return NotFound(new { message = "Job not found" });

            return Ok(job);
        }

        /// <summary>
        /// Search jobs with filters (Public access)
        /// </summary>
        [HttpPost("search")]
        public async Task<ActionResult<IEnumerable<JobDto>>> SearchJobs([FromBody] JobSearchDto searchDto)
        {
            var jobs = await _jobService.SearchJobsAsync(searchDto);
            return Ok(jobs);
        }

        /// <summary>
        /// Get jobs posted by current employer
        /// </summary>
        [HttpGet("my-jobs")]
        [Authorize(Roles = "Employer")]
        public async Task<ActionResult<IEnumerable<JobDto>>> GetMyJobs()
        {
            var userId = GetCurrentUserId();
            var jobs = await _jobService.GetJobsByUserAsync(userId);
            return Ok(jobs);
        }

        /// <summary>
        /// Get jobs by company ID (Public access)
        /// </summary>
        [HttpGet("company/{companyId}")]
        public async Task<ActionResult<IEnumerable<JobDto>>> GetJobsByCompany(int companyId)
        {
            var jobs = await _jobService.GetJobsByCompanyAsync(companyId);
            return Ok(jobs);
        }

        /// <summary>
        /// Create a new job posting
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Employer")]
        public async Task<ActionResult<JobDto>> CreateJob([FromBody] CreateJobDto createDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var job = await _jobService.CreateJobAsync(userId, createDto);
                return CreatedAtAction(nameof(GetJobById), new { id = job.Id }, job);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Update job posting
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Employer")]
        public async Task<ActionResult<JobDto>> UpdateJob(int id, [FromBody] CreateJobDto updateDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var job = await _jobService.UpdateJobAsync(id, userId, updateDto);
                return Ok(job);
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
        /// Delete job posting (soft delete)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _jobService.DeleteJobAsync(id, userId);
                
                if (!result)
                    return NotFound(new { message = "Job not found" });

                return Ok(new { message = "Job deleted successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        /// <summary>
        /// Get total jobs count (Admin only)
        /// </summary>
        [HttpGet("count")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<int>> GetTotalJobsCount()
        {
            var count = await _jobService.GetTotalJobsCountAsync();
            return Ok(new { totalJobs = count });
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("userId")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }
    }
}
