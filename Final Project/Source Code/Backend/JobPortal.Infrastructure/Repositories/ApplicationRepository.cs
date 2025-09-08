using JobPortal.Core.Entities;
using JobPortal.Core.Interfaces;
using JobPortal.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using JobPortal.Core.DTOs;

namespace JobPortal.Infrastructure.Repositories
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly JobPortalDbContext _context;

        public ApplicationRepository(JobPortalDbContext context)
        {
            _context = context;
        }

        public async Task<JobApplication?> GetByIdAsync(int id)
        {
            return await _context.JobApplications
                .Include(a => a.Job)
                    .ThenInclude(j => j.Company)
                .Include(a => a.Applicant)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<IEnumerable<JobApplication>> GetAllAsync()
        {
            return await _context.JobApplications
                .Include(a => a.Job)
                    .ThenInclude(j => j.Company)
                .Include(a => a.Applicant)
                .OrderByDescending(a => a.AppliedDate)
                .ToListAsync();
        }

        public async Task<JobApplication> CreateAsync(JobApplication application)
        {
            _context.JobApplications.Add(application);
            await _context.SaveChangesAsync();
            return application;
        }

        public async Task<JobApplication> UpdateAsync(JobApplication application)
        {
            _context.JobApplications.Update(application);
            await _context.SaveChangesAsync();
            return application;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var application = await _context.JobApplications.FindAsync(id);
            if (application == null) return false;

            _context.JobApplications.Remove(application);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<JobApplication>> GetByJobIdAsync(int jobId)
        {
            return await _context.JobApplications
                .Include(a => a.Job)
                    .ThenInclude(j => j.Company)
                .Include(a => a.Applicant)
                .Where(a => a.JobId == jobId)
                .OrderByDescending(a => a.AppliedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<JobApplication>> GetByApplicantIdAsync(int applicantId)
        {
            return await _context.JobApplications
                .Include(a => a.Job)
                    .ThenInclude(j => j.Company)
                .Include(a => a.Applicant)
                .Where(a => a.ApplicantId == applicantId)
                .OrderByDescending(a => a.AppliedDate)
                .ToListAsync();
        }

        public async Task<JobApplication?> GetByJobAndApplicantAsync(int jobId, int applicantId)
        {
            return await _context.JobApplications
                .Include(a => a.Job)
                    .ThenInclude(j => j.Company)
                .Include(a => a.Applicant)
                .FirstOrDefaultAsync(a => a.JobId == jobId && a.ApplicantId == applicantId);
        }

        public async Task<bool> HasAppliedAsync(int jobId, int applicantId)
        {
            return await _context.JobApplications
                .AnyAsync(a => a.JobId == jobId && a.ApplicantId == applicantId);
        }

        public async Task<int> GetApplicationCountByJobAsync(int jobId)
        {
            return await _context.JobApplications
                .CountAsync(a => a.JobId == jobId);
        }
      public async Task<IEnumerable<ApplicationDto>> GetByEmployerIdAsync(int employerId)
{
    return await _context.JobApplications
        .Include(a => a.Job)
            .ThenInclude(j => j.Company)
        .Include(a => a.Applicant)
        .Where(a => a.Job.PostedByUserId == employerId) // match employer with PostedByUserId
        .Select(a => MapToDto(a))
        .ToListAsync();
}

private static ApplicationDto MapToDto(JobApplication a) =>
    new ApplicationDto
    {
        Id = a.Id,
        JobId = a.JobId,
        JobTitle = a.Job.Title,
        CompanyName = a.Job.Company.Name,
        ApplicantId = a.ApplicantId,
        ApplicantName = a.Applicant.FirstName,
        ApplicantEmail = a.Applicant.Email,
        CoverLetter = a.CoverLetter,
        Status = a.Status, // if enum, convert to string
        AppliedDate = a.AppliedDate,
        ReviewedDate = a.ReviewedDate,
        ReviewNotes = a.ReviewNotes,
        InterviewDate = a.InterviewDate,
        InterviewNotes = a.InterviewNotes
    };

    }
}
