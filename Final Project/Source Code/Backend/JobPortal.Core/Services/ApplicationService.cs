using JobPortal.Core.DTOs;
using JobPortal.Core.Entities;
using JobPortal.Core.Interfaces;

namespace JobPortal.Core.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IJobRepository _jobRepository;
        private readonly IUserRepository _userRepository;

        public ApplicationService(IApplicationRepository applicationRepository, IJobRepository jobRepository, IUserRepository userRepository)
        {
            _applicationRepository = applicationRepository;
            _jobRepository = jobRepository;
            _userRepository = userRepository;
        }

        public async Task<ApplicationDto?> GetApplicationByIdAsync(int id)
        {
            var application = await _applicationRepository.GetByIdAsync(id);
            return application != null ? MapToDto(application) : null;
        }

        public async Task<IEnumerable<ApplicationDto>> GetApplicationsByJobAsync(int jobId)
        {
            var applications = await _applicationRepository.GetByJobIdAsync(jobId);
            return applications.Select(MapToDto);
        }

        public async Task<IEnumerable<ApplicationDto>> GetApplicationsByApplicantAsync(int applicantId)
        {
            var applications = await _applicationRepository.GetByApplicantIdAsync(applicantId);
            return applications.Select(MapToDto);
        }

        public async Task<ApplicationDto> CreateApplicationAsync(int applicantId, CreateApplicationDto createDto)
        {
            // Verify job exists and is active
            var job = await _jobRepository.GetByIdAsync(createDto.JobId);
            if (job == null || !job.IsActive)
            {
                throw new ArgumentException("Job not found or is no longer active");
            }

            // Check if application deadline has passed
            if (job.ApplicationDeadline.HasValue && job.ApplicationDeadline.Value < DateTime.UtcNow)
            {
                throw new InvalidOperationException("Application deadline has passed");
            }

            // Check if user has already applied
            if (await _applicationRepository.HasAppliedAsync(createDto.JobId, applicantId))
            {
                throw new InvalidOperationException("You have already applied for this job");
            }

            // Verify applicant is a job seeker
            var applicant = await _userRepository.GetByIdAsync(applicantId);
            if (applicant == null || applicant.Role != UserRole.JobSeeker)
            {
                throw new ArgumentException("Invalid applicant or user is not a job seeker");
            }

            var application = new JobApplication
            {
                JobId = createDto.JobId,
                ApplicantId = applicantId,
                CoverLetter = createDto.CoverLetter,
                Status = ApplicationStatus.Applied,
                AppliedDate = DateTime.UtcNow
            };

            var createdApplication = await _applicationRepository.CreateAsync(application);

            // Reload with includes
            var fullApplication = await _applicationRepository.GetByIdAsync(createdApplication.Id);
            return MapToDto(fullApplication!);
        }

        public async Task<ApplicationDto> UpdateApplicationStatusAsync(int applicationId, int employerId, UpdateApplicationStatusDto updateDto)
{
    var application = await _applicationRepository.GetByIdAsync(applicationId);
    if (application == null)
    {
        throw new ArgumentException("Application not found");
    }

    // ✅ Fetch the job directly
    var job = await _jobRepository.GetByIdAsync(application.JobId);
    if (job == null)
    {
        throw new ArgumentException("Job not found");
    }

    // ✅ Compare with PostedByUserId
    if (job.PostedByUserId != employerId)
    {
        throw new UnauthorizedAccessException("You can only update applications for your own job postings");
    }

    // Update application
    application.Status = updateDto.Status;
    application.ReviewNotes = updateDto.ReviewNotes;
    application.InterviewDate = updateDto.InterviewDate;
    application.InterviewNotes = updateDto.InterviewNotes;
    application.ReviewedDate = DateTime.UtcNow;

    var updatedApplication = await _applicationRepository.UpdateAsync(application);
    return MapToDto(updatedApplication);
}

        public async Task<bool> DeleteApplicationAsync(int applicationId, int userId)
        {
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            if (application == null) return false;

            // Only applicant can delete their own application
            if (application.ApplicantId != userId)
            {
                throw new UnauthorizedAccessException("You can only delete your own applications");
            }

            return await _applicationRepository.DeleteAsync(applicationId);
        }

        public async Task<bool> HasAppliedAsync(int jobId, int applicantId)
        {
            return await _applicationRepository.HasAppliedAsync(jobId, applicantId);
        }

        public async Task<int> GetApplicationCountByJobAsync(int jobId)
        {
            return await _applicationRepository.GetApplicationCountByJobAsync(jobId);
        }

        private ApplicationDto MapToDto(JobApplication application)
        {
            return new ApplicationDto
            {
                Id = application.Id,
                JobId = application.JobId,
                JobTitle = application.Job?.Title ?? "",
                CompanyName = application.Job?.Company?.Name ?? "",
                ApplicantId = application.ApplicantId,
                ApplicantName = $"{application.Applicant?.FirstName} {application.Applicant?.LastName}",
                ApplicantEmail = application.Applicant?.Email ?? "",
                CoverLetter = application.CoverLetter,
                Status = application.Status,
                AppliedDate = application.AppliedDate,
                ReviewedDate = application.ReviewedDate,
                ReviewNotes = application.ReviewNotes,
                InterviewDate = application.InterviewDate,
                InterviewNotes = application.InterviewNotes
            };
        }
        public async Task<IEnumerable<ApplicationDto>> GetApplicationsForEmployerAsync(int employerId)
            => await _applicationRepository.GetByEmployerIdAsync(employerId);
    }
}
