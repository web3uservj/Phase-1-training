using JobPortal.Core.DTOs;
using Microsoft.AspNetCore.Http;

namespace JobPortal.Core.Interfaces
{
    public interface IJobSeekerProfileService
    {
        Task<JobSeekerProfileDto?> GetProfileByUserIdAsync(int userId);
        Task<JobSeekerProfileDto> CreateProfileAsync(int userId, CreateJobSeekerProfileDto createDto);
        Task<JobSeekerProfileDto> UpdateProfileAsync(int userId, UpdateJobSeekerProfileDto updateDto);
        Task<bool> DeleteProfileAsync(int userId);
        Task<JobSeekerProfileDto> UploadResumeAsync(int userId, IFormFile file);
        Task<bool> DeleteResumeAsync(int userId);
        Task<IEnumerable<JobSeekerProfileDto>> SearchProfilesBySkillsAsync(string skills);
        Task<IEnumerable<JobSeekerProfileDto>> SearchProfilesByLocationAsync(string location);
        Task<(byte[] Content, string ContentType, string FileName)?> GetResumeAsync(int userId);

    }
}
