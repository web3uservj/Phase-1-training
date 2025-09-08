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
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _companyService;

        public CompanyController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        /// <summary>
        /// Get current user's company profile
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Employer")]
        public async Task<ActionResult<CompanyDto>> GetCompany()
        {
            var userId = GetCurrentUserId();
            var company = await _companyService.GetCompanyByUserIdAsync(userId);
            
            if (company == null)
                return NotFound(new { message = "Company not found" });

            return Ok(company);
        }

        /// <summary>
        /// Get all companies (Public access for job seekers to view)
        /// </summary>
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<CompanyDto>>> GetAllCompanies()
        {
            var companies = await _companyService.GetAllCompaniesAsync();
            return Ok(companies);
        }

        /// <summary>
        /// Get company by ID (Public access)
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<CompanyDto>> GetCompanyById(int id)
        {
            var company = await _companyService.GetCompanyByIdAsync(id);
            
            if (company == null)
                return NotFound(new { message = "Company not found" });

            return Ok(company);
        }

        /// <summary>
        /// Create company profile
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Employer")]
        public async Task<ActionResult<CompanyDto>> CreateCompany([FromBody] CreateCompanyDto createDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var company = await _companyService.CreateCompanyAsync(userId, createDto);
                return CreatedAtAction(nameof(GetCompany), new { }, company);
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
        /// Update company profile
        /// </summary>
        [HttpPut]
        [Authorize(Roles = "Employer")]
        public async Task<ActionResult<CompanyDto>> UpdateCompany([FromBody] UpdateCompanyDto updateDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var company = await _companyService.UpdateCompanyAsync(userId, updateDto);
                return Ok(company);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Upload company logo
        /// </summary>
        [HttpPost("logo")]
        [Authorize(Roles = "Employer")]
        public async Task<ActionResult<CompanyDto>> UploadLogo([FromForm] IFormFile file)
        {
            try
            {
                var userId = GetCurrentUserId();
                var company = await _companyService.UploadLogoAsync(userId, file);
                return Ok(company);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Delete company logo
        /// </summary>
        [HttpDelete("logo")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> DeleteLogo()
        {
            var userId = GetCurrentUserId();
            var result = await _companyService.DeleteLogoAsync(userId);
            
            if (!result)
                return NotFound(new { message = "Logo not found" });

            return Ok(new { message = "Logo deleted successfully" });
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("userId")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }
    }
}
