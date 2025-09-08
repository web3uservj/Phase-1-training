using JobPortal.Core.DTOs;

namespace JobPortal.Core.Interfaces
{
    public interface IJobRecommendationService
    {
        Task<IEnumerable<JobDto>> GetRecommendedJobsAsync(int userId, int count = 10);
        Task<IEnumerable<JobDto>> GetSimilarJobsAsync(int jobId, int count = 5);
        Task<IEnumerable<JobSeekerProfileDto>> GetRecommendedCandidatesAsync(int jobId, int count = 10);
    }
}
