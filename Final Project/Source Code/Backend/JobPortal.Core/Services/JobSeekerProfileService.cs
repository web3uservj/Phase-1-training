using JobPortal.Core.DTOs;
using JobPortal.Core.Entities;
using JobPortal.Core.Interfaces;
using Microsoft.AspNetCore.Http;

namespace JobPortal.Core.Services
{
    public class JobSeekerProfileService : IJobSeekerProfileService
    {
        private readonly IJobSeekerProfileRepository _profileRepository;
        private readonly IUserRepository _userRepository;

        public JobSeekerProfileService(IJobSeekerProfileRepository profileRepository, IUserRepository userRepository)
        {
            _profileRepository = profileRepository;
            _userRepository = userRepository;
        }

        public async Task<JobSeekerProfileDto?> GetProfileByUserIdAsync(int userId)
        {
            var profile = await _profileRepository.GetByUserIdAsync(userId);
            return profile != null ? MapToDto(profile) : null;
        }

        public async Task<JobSeekerProfileDto> CreateProfileAsync(int userId, CreateJobSeekerProfileDto createDto)
        {
            // Verify user exists and is a job seeker
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null || user.Role != UserRole.JobSeeker)
            {
                throw new ArgumentException("Invalid user or user is not a job seeker");
            }

            // Check if profile already exists
            if (await _profileRepository.ExistsAsync(userId))
            {
                throw new InvalidOperationException("Profile already exists for this user");
            }

            var profile = new JobSeekerProfile
            {
                UserId = userId,
                Summary = createDto.Summary,
                Skills = createDto.Skills,
                Education = createDto.Education,
                Experience = createDto.Experience,
                Location = createDto.Location,
                ExpectedSalary = createDto.ExpectedSalary,
                CreatedAt = DateTime.UtcNow
            };

            var createdProfile = await _profileRepository.CreateAsync(profile);
            return MapToDto(createdProfile);
        }

        public async Task<JobSeekerProfileDto> UpdateProfileAsync(int userId, UpdateJobSeekerProfileDto updateDto)
        {
            var profile = await _profileRepository.GetByUserIdAsync(userId);
            if (profile == null)
            {
                throw new ArgumentException("Profile not found");
            }

            // Update only provided fields
            if (updateDto.Summary != null)
                profile.Summary = updateDto.Summary;

            if (updateDto.Skills != null)
                profile.Skills = updateDto.Skills;

            if (updateDto.Education != null)
                profile.Education = updateDto.Education;

            if (updateDto.Experience != null)
                profile.Experience = updateDto.Experience;

            if (updateDto.Location != null)
                profile.Location = updateDto.Location;

            if (updateDto.ExpectedSalary.HasValue)
                profile.ExpectedSalary = updateDto.ExpectedSalary;

            var updatedProfile = await _profileRepository.UpdateAsync(profile);
            return MapToDto(updatedProfile);
        }

        public async Task<bool> DeleteProfileAsync(int userId)
        {
            var profile = await _profileRepository.GetByUserIdAsync(userId);
            if (profile == null) return false;

            return await _profileRepository.DeleteAsync(profile.Id);
        }

        public async Task<JobSeekerProfileDto> UploadResumeAsync(int userId, IFormFile file)
        {
            var profile = await _profileRepository.GetByUserIdAsync(userId);
            if (profile == null)
            {
                throw new ArgumentException("Profile not found");
            }

            // Validate file
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("Invalid file");
            }

            var allowedExtensions = new[] { ".pdf", ".doc", ".docx" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(fileExtension))
            {
                throw new ArgumentException("Only PDF, DOC, and DOCX files are allowed");
            }

            // Create uploads directory if it doesn't exist
            var uploadsPath = Path.Combine("wwwroot", "uploads", "resumes");
            Directory.CreateDirectory(uploadsPath);

            // Generate unique filename
            var fileName = $"{userId}_{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Update profile
            profile.ResumeFileName = file.FileName;
            profile.ResumeFilePath = $"/uploads/resumes/{fileName}";

            var updatedProfile = await _profileRepository.UpdateAsync(profile);
            return MapToDto(updatedProfile);
        }

        public async Task<bool> DeleteResumeAsync(int userId)
        {
            var profile = await _profileRepository.GetByUserIdAsync(userId);
            if (profile == null || string.IsNullOrEmpty(profile.ResumeFilePath))
            {
                return false;
            }

            // Delete physical file
            var physicalPath = Path.Combine("wwwroot", profile.ResumeFilePath.TrimStart('/'));
            if (File.Exists(physicalPath))
            {
                File.Delete(physicalPath);
            }

            // Update profile
            profile.ResumeFileName = null;
            profile.ResumeFilePath = null;

            await _profileRepository.UpdateAsync(profile);
            return true;
        }

        public async Task<IEnumerable<JobSeekerProfileDto>> SearchProfilesBySkillsAsync(string skills)
        {
            var profiles = await _profileRepository.SearchBySkillsAsync(skills);
            return profiles.Select(MapToDto);
        }

        public async Task<IEnumerable<JobSeekerProfileDto>> SearchProfilesByLocationAsync(string location)
        {
            var profiles = await _profileRepository.SearchByLocationAsync(location);
            return profiles.Select(MapToDto);
        }

        private JobSeekerProfileDto MapToDto(JobSeekerProfile profile)
        {
            return new JobSeekerProfileDto
            {
                Id = profile.Id,
                UserId = profile.UserId,
                Summary = profile.Summary,
                Skills = profile.Skills,
                Education = profile.Education,
                Experience = profile.Experience,
                ResumeFileName = profile.ResumeFileName,
                ResumeFilePath = profile.ResumeFilePath,
                Location = profile.Location,
                ExpectedSalary = profile.ExpectedSalary,
                CreatedAt = profile.CreatedAt,
                UpdatedAt = profile.UpdatedAt
            };
        }
       public async Task<(byte[] Content, string ContentType, string FileName)?> GetResumeAsync(int userId)
{
    var profile = await _profileRepository.GetResumeByUserIdAsync(userId);
    if (profile == null || string.IsNullOrEmpty(profile.ResumeFilePath))
        return null;

    var physicalPath = Path.Combine("wwwroot", profile.ResumeFilePath.TrimStart('/'));
    if (!File.Exists(physicalPath)) return null;

    var content = await File.ReadAllBytesAsync(physicalPath);

    var extension = Path.GetExtension(profile.ResumeFileName)?.ToLower();
    var contentType = extension switch
    {
        ".pdf" => "application/pdf",
        ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".doc" => "application/msword",
        _ => "application/octet-stream"
    };

    return (content, contentType, profile.ResumeFileName);
}

    }
}
