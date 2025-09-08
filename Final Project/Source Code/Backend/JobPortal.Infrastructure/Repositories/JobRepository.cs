using JobPortal.Core.Entities;
using JobPortal.Core.Interfaces;
using JobPortal.Core.DTOs;
using JobPortal.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.Infrastructure.Repositories
{
    public class JobRepository : IJobRepository
    {
        private readonly JobPortalDbContext _context;

        public JobRepository(JobPortalDbContext context)
        {
            _context = context;
        }

        public async Task<Job?> GetByIdAsync(int id)
        {
            return await _context.Jobs
                .Include(j => j.Company)
                .Include(j => j.PostedBy)
                .Include(j => j.Applications)
                .FirstOrDefaultAsync(j => j.Id == id);
        }

        public async Task<IEnumerable<Job>> GetAllAsync()
        {
            return await _context.Jobs
                .Include(j => j.Company)
                .Include(j => j.PostedBy)
                .Where(j => j.IsActive)
                .OrderByDescending(j => j.PostedDate)
                .ToListAsync();
        }

        public async Task<Job> CreateAsync(Job job)
        {
            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();
            return job;
        }

        public async Task<Job> UpdateAsync(Job job)
        {
            _context.Jobs.Update(job);
            await _context.SaveChangesAsync();
            return job;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return false;

            job.IsActive = false; // Soft delete
            _context.Jobs.Update(job);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Job>> SearchJobsAsync(JobSearchDto searchDto)
        {
            var query = _context.Jobs
                .Include(j => j.Company)
                .Include(j => j.PostedBy)
                .Where(j => j.IsActive);

            // Apply filters
            if (!string.IsNullOrEmpty(searchDto.Title))
            {
                query = query.Where(j => j.Title.Contains(searchDto.Title));
            }

            if (!string.IsNullOrEmpty(searchDto.Location))
            {
                query = query.Where(j => j.Location != null && j.Location.Contains(searchDto.Location));
            }

            if (!string.IsNullOrEmpty(searchDto.Category))
            {
                query = query.Where(j => j.Category != null && j.Category.Contains(searchDto.Category));
            }

            if (searchDto.JobType.HasValue)
            {
                query = query.Where(j => j.JobType == searchDto.JobType.Value);
            }

            if (searchDto.ExperienceLevel.HasValue)
            {
                query = query.Where(j => j.ExperienceLevel == searchDto.ExperienceLevel.Value);
            }

            if (searchDto.MinSalary.HasValue)
            {
                query = query.Where(j => j.MinSalary >= searchDto.MinSalary.Value);
            }

            if (searchDto.MaxSalary.HasValue)
            {
                query = query.Where(j => j.MaxSalary <= searchDto.MaxSalary.Value);
            }

            // Apply pagination
            var skip = (searchDto.Page - 1) * searchDto.PageSize;
            
            return await query
                .OrderByDescending(j => j.PostedDate)
                .Skip(skip)
                .Take(searchDto.PageSize)
                .ToListAsync();
        }

        public async Task<IEnumerable<Job>> GetJobsByCompanyAsync(int companyId)
        {
            return await _context.Jobs
                .Include(j => j.Company)
                .Include(j => j.PostedBy)
                .Where(j => j.CompanyId == companyId && j.IsActive)
                .OrderByDescending(j => j.PostedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Job>> GetJobsByUserAsync(int userId)
        {
            return await _context.Jobs
                .Include(j => j.Company)
                .Include(j => j.PostedBy)
                .Where(j => j.PostedByUserId == userId && j.IsActive)
                .OrderByDescending(j => j.PostedDate)
                .ToListAsync();
        }

        public async Task<int> GetTotalCountAsync()
        {
            return await _context.Jobs.CountAsync(j => j.IsActive);
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Jobs.AnyAsync(j => j.Id == id && j.IsActive);
        }
    }
}
