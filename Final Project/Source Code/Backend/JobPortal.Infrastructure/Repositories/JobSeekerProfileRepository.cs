using JobPortal.Core.Entities;
using JobPortal.Core.Interfaces;
using JobPortal.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.Infrastructure.Repositories
{
    public class JobSeekerProfileRepository : IJobSeekerProfileRepository
    {
        private readonly JobPortalDbContext _context;

        public JobSeekerProfileRepository(JobPortalDbContext context)
        {
            _context = context;
        }

        public async Task<JobSeekerProfile?> GetByIdAsync(int id)
        {
            return await _context.JobSeekerProfiles
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<JobSeekerProfile?> GetByUserIdAsync(int userId)
        {
            return await _context.JobSeekerProfiles
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.UserId == userId);
        }

        public async Task<IEnumerable<JobSeekerProfile>> GetAllAsync()
        {
            return await _context.JobSeekerProfiles
                .Include(p => p.User)
                .ToListAsync();
        }

        public async Task<JobSeekerProfile> CreateAsync(JobSeekerProfile profile)
        {
            _context.JobSeekerProfiles.Add(profile);
            await _context.SaveChangesAsync();
            return profile;
        }

        public async Task<JobSeekerProfile> UpdateAsync(JobSeekerProfile profile)
        {
            profile.UpdatedAt = DateTime.UtcNow;
            _context.JobSeekerProfiles.Update(profile);
            await _context.SaveChangesAsync();
            return profile;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var profile = await _context.JobSeekerProfiles.FindAsync(id);
            if (profile == null) return false;

            _context.JobSeekerProfiles.Remove(profile);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int userId)
        {
            return await _context.JobSeekerProfiles.AnyAsync(p => p.UserId == userId);
        }

        public async Task<IEnumerable<JobSeekerProfile>> SearchBySkillsAsync(string skills)
        {
            return await _context.JobSeekerProfiles
                .Include(p => p.User)
                .Where(p => p.Skills != null && p.Skills.Contains(skills))
                .ToListAsync();
        }

        public async Task<IEnumerable<JobSeekerProfile>> SearchByLocationAsync(string location)
        {
            return await _context.JobSeekerProfiles
                .Include(p => p.User)
                .Where(p => p.Location != null && p.Location.Contains(location))
                .ToListAsync();
        }
        public async Task<JobSeekerProfile?> GetResumeByUserIdAsync(int userId)
        {
            return await _context.JobSeekerProfiles
                .Where(p => p.UserId == userId && !string.IsNullOrEmpty(p.ResumeFilePath))
                .FirstOrDefaultAsync();
        }


    }
}
