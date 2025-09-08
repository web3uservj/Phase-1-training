using JobPortal.Core.DTOs;

namespace JobPortal.Core.Interfaces
{
    public interface IApplicationService
    {
        Task<ApplicationDto?> GetApplicationByIdAsync(int id);
        Task<IEnumerable<ApplicationDto>> GetApplicationsByJobAsync(int jobId);
        Task<IEnumerable<ApplicationDto>> GetApplicationsByApplicantAsync(int applicantId);
        Task<ApplicationDto> CreateApplicationAsync(int applicantId, CreateApplicationDto createDto);
        Task<ApplicationDto> UpdateApplicationStatusAsync(int applicationId, int employerId, UpdateApplicationStatusDto updateDto);
        Task<bool> DeleteApplicationAsync(int applicationId, int userId);
        Task<bool> HasAppliedAsync(int jobId, int applicantId);
        Task<int> GetApplicationCountByJobAsync(int jobId);
        Task<IEnumerable<ApplicationDto>> GetApplicationsForEmployerAsync(int employerId);

    }
}
