using JobPortal.Core.Entities;
using JobPortal.Core.DTOs;

namespace JobPortal.Core.Interfaces
{
    public interface IJobRepository
    {
        Task<Job?> GetByIdAsync(int id);
        Task<IEnumerable<Job>> GetAllAsync();
        Task<Job> CreateAsync(Job job);
        Task<Job> UpdateAsync(Job job);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Job>> SearchJobsAsync(JobSearchDto searchDto);
        Task<IEnumerable<Job>> GetJobsByCompanyAsync(int companyId);
        Task<IEnumerable<Job>> GetJobsByUserAsync(int userId);
        Task<int> GetTotalCountAsync();
        Task<bool> ExistsAsync(int id);
    }
}
