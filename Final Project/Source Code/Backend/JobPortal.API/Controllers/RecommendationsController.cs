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
    public class RecommendationsController : ControllerBase
    {
        private readonly IJobRecommendationService _recommendationService;

        public RecommendationsController(IJobRecommendationService recommendationService)
        {
            _recommendationService = recommendationService;
        }

        /// <summary>
        /// Get recommended jobs for current user
        /// </summary>
        [HttpGet("jobs")]
        [Authorize(Roles = "JobSeeker")]
        public async Task<ActionResult<IEnumerable<JobDto>>> GetRecommendedJobs([FromQuery] int count = 10)
        {
            var userId = GetCurrentUserId();
            var recommendations = await _recommendationService.GetRecommendedJobsAsync(userId, count);
            return Ok(recommendations);
        }

        /// <summary>
        /// Get similar jobs to a specific job
        /// </summary>
        [HttpGet("jobs/{jobId}/similar")]
        public async Task<ActionResult<IEnumerable<JobDto>>> GetSimilarJobs(int jobId, [FromQuery] int count = 5)
        {
            var similarJobs = await _recommendationService.GetSimilarJobsAsync(jobId, count);
            return Ok(similarJobs);
        }

        /// <summary>
        /// Get recommended candidates for a job (Employer only)
        /// </summary>
        [HttpGet("candidates/{jobId}")]
        [Authorize(Roles = "Employer")]
        public async Task<ActionResult<IEnumerable<JobSeekerProfileDto>>> GetRecommendedCandidates(int jobId, [FromQuery] int count = 10)
        {
            var candidates = await _recommendationService.GetRecommendedCandidatesAsync(jobId, count);
            return Ok(candidates);
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("userId")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }
    }
}
