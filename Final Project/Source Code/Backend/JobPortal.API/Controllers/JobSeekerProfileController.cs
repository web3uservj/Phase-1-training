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
    public class JobSeekerProfileController : ControllerBase
    {
        private readonly IJobSeekerProfileService _profileService;

        public JobSeekerProfileController(IJobSeekerProfileService profileService)
        {
            _profileService = profileService;
        }

        /// <summary>
        /// Get current user's job seeker profile
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "JobSeeker")]
        public async Task<ActionResult<JobSeekerProfileDto>> GetProfile()
        {
            var userId = GetCurrentUserId();
            var profile = await _profileService.GetProfileByUserIdAsync(userId);
            
            if (profile == null)
                return NotFound(new { message = "Profile not found" });

            return Ok(profile);
        }

        /// <summary>
        /// Create job seeker profile
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "JobSeeker")]
        public async Task<ActionResult<JobSeekerProfileDto>> CreateProfile([FromBody] CreateJobSeekerProfileDto createDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var profile = await _profileService.CreateProfileAsync(userId, createDto);
                return CreatedAtAction(nameof(GetProfile), new { }, profile);
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
        /// Update job seeker profile
        /// </summary>
        [HttpPut]
        [Authorize(Roles = "JobSeeker")]
        public async Task<ActionResult<JobSeekerProfileDto>> UpdateProfile([FromBody] UpdateJobSeekerProfileDto updateDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var profile = await _profileService.UpdateProfileAsync(userId, updateDto);
                return Ok(profile);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Upload resume
        /// </summary>
        [HttpPost("resume")]
        [Authorize(Roles = "JobSeeker")]
        public async Task<ActionResult<JobSeekerProfileDto>> UploadResume([FromForm] IFormFile file)
        {
            try
            {
                var userId = GetCurrentUserId();
                var profile = await _profileService.UploadResumeAsync(userId, file);
                return Ok(profile);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Delete resume
        /// </summary>
        [HttpDelete("resume")]
        [Authorize(Roles = "JobSeeker")]
        public async Task<IActionResult> DeleteResume()
        {
            var userId = GetCurrentUserId();
            var result = await _profileService.DeleteResumeAsync(userId);
            
            if (!result)
                return NotFound(new { message = "Resume not found" });

            return Ok(new { message = "Resume deleted successfully" });
        }

        /// <summary>
        /// Search profiles by skills (Admin/Employer only)
        /// </summary>
        [HttpGet("search/skills")]
        [Authorize(Roles = "Admin,Employer")]
        public async Task<ActionResult<IEnumerable<JobSeekerProfileDto>>> SearchBySkills([FromQuery] string skills)
        {
            if (string.IsNullOrEmpty(skills))
                return BadRequest(new { message = "Skills parameter is required" });

            var profiles = await _profileService.SearchProfilesBySkillsAsync(skills);
            return Ok(profiles);
        }

        /// <summary>
        /// Search profiles by location (Admin/Employer only)
        /// </summary>
        [HttpGet("search/location")]
        [Authorize(Roles = "Admin,Employer")]
        public async Task<ActionResult<IEnumerable<JobSeekerProfileDto>>> SearchByLocation([FromQuery] string location)
        {
            if (string.IsNullOrEmpty(location))
                return BadRequest(new { message = "Location parameter is required" });

            var profiles = await _profileService.SearchProfilesByLocationAsync(location);
            return Ok(profiles);
        }

        /// <summary>
/// Get a job seeker's resume (Admin/Employer only)
/// </summary>
[HttpGet("{userId}/resume")]
[Authorize(Roles = "Admin,Employer")]
public async Task<IActionResult> GetResume(int userId)
{
    var fileResult = await _profileService.GetResumeAsync(userId);
    if (!fileResult.HasValue)
        return NotFound(new { message = "Resume not found" });

    return File(fileResult.Value.Content, fileResult.Value.ContentType, fileResult.Value.FileName);
}


        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("userId")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }
    }
}
