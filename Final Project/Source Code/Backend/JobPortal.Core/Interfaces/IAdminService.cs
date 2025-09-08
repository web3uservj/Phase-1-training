using JobPortal.Core.DTOs;

namespace JobPortal.Core.Interfaces
{
    public interface IAdminService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();
        Task<IEnumerable<UserManagementDto>> GetAllUsersForManagementAsync();
        Task<UserManagementDto> UpdateUserStatusAsync(int userId, UpdateUserStatusDto updateDto);
        Task<bool> DeleteUserAsync(int userId);
        Task<IEnumerable<JobModerationDto>> GetJobsForModerationAsync();
        Task<bool> ApproveJobAsync(int jobId);
        Task<bool> RejectJobAsync(int jobId, string reason);
        Task<ReportDto> GenerateUserReportAsync(DateTime startDate, DateTime endDate);
        Task<ReportDto> GenerateJobReportAsync(DateTime startDate, DateTime endDate);
        Task<ReportDto> GenerateApplicationReportAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<SystemActivityDto>> GetSystemActivityAsync(int days = 30);
    }
}
