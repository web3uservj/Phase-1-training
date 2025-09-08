using JobPortal.Core.DTOs;

namespace JobPortal.Core.Interfaces
{
    public interface IJobService
    {
        Task<JobDto?> GetJobByIdAsync(int id);
        Task<IEnumerable<JobDto>> GetAllJobsAsync();
        Task<JobDto> CreateJobAsync(int userId, CreateJobDto createDto);
        Task<JobDto> UpdateJobAsync(int jobId, int userId, CreateJobDto updateDto);
        Task<bool> DeleteJobAsync(int jobId, int userId);
        Task<IEnumerable<JobDto>> SearchJobsAsync(JobSearchDto searchDto);
        Task<IEnumerable<JobDto>> GetJobsByUserAsync(int userId);
        Task<IEnumerable<JobDto>> GetJobsByCompanyAsync(int companyId);
        Task<int> GetTotalJobsCountAsync();
    }
}
