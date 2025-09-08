using JobPortal.Core.Entities;
using JobPortal.Core.DTOs;

namespace JobPortal.Core.Interfaces
{
    public interface IApplicationRepository
    {
        Task<JobApplication?> GetByIdAsync(int id);
        Task<IEnumerable<JobApplication>> GetAllAsync();
        Task<JobApplication> CreateAsync(JobApplication application);
        Task<JobApplication> UpdateAsync(JobApplication application);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<JobApplication>> GetByJobIdAsync(int jobId);
        Task<IEnumerable<JobApplication>> GetByApplicantIdAsync(int applicantId);
        Task<JobApplication?> GetByJobAndApplicantAsync(int jobId, int applicantId);
        Task<bool> HasAppliedAsync(int jobId, int applicantId);
        Task<int> GetApplicationCountByJobAsync(int jobId);
         Task<IEnumerable<ApplicationDto>> GetByEmployerIdAsync(int employerId);
    }
}
