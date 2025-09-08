using Microsoft.AspNetCore.Mvc;
using JobPortal.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly JobPortalDbContext _context;

        public HealthController(JobPortalDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Basic health check endpoint
        /// </summary>
        [HttpGet]
        public async Task<ActionResult> GetHealth()
        {
            try
            {
                // Test database connection
                await _context.Database.CanConnectAsync();
                
                var health = new
                {
                    Status = "Healthy",
                    Timestamp = DateTime.UtcNow,
                    Version = "1.0.0",
                    Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production",
                    Services = new
                    {
                        Database = "Connected",
                        API = "Running"
                    }
                };

                return Ok(health);
            }
            catch (Exception ex)
            {
                var health = new
                {
                    Status = "Unhealthy",
                    Timestamp = DateTime.UtcNow,
                    Error = ex.Message,
                    Services = new
                    {
                        Database = "Disconnected",
                        API = "Running"
                    }
                };

                return StatusCode(503, health);
            }
        }
    }
}
