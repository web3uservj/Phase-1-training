using JobPortal.Core.Entities;

namespace JobPortal.Core.Interfaces
{
    public interface IJobSeekerProfileRepository
    {
        Task<JobSeekerProfile?> GetByIdAsync(int id);
        Task<JobSeekerProfile?> GetByUserIdAsync(int userId);
        Task<IEnumerable<JobSeekerProfile>> GetAllAsync();
        Task<JobSeekerProfile> CreateAsync(JobSeekerProfile profile);
        Task<JobSeekerProfile> UpdateAsync(JobSeekerProfile profile);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int userId);
        Task<IEnumerable<JobSeekerProfile>> SearchBySkillsAsync(string skills);
        Task<IEnumerable<JobSeekerProfile>> SearchByLocationAsync(string location);
        Task<JobSeekerProfile?> GetResumeByUserIdAsync(int userId);
    }
}
