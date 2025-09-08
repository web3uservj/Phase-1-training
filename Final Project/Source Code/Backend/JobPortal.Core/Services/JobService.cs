using JobPortal.Core.DTOs;
using JobPortal.Core.Entities;
using JobPortal.Core.Interfaces;

namespace JobPortal.Core.Services
{
    public class JobService : IJobService
    {
        private readonly IJobRepository _jobRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly IApplicationRepository _applicationRepository;

        public JobService(IJobRepository jobRepository, ICompanyRepository companyRepository, IApplicationRepository applicationRepository)
        {
            _jobRepository = jobRepository;
            _companyRepository = companyRepository;
            _applicationRepository = applicationRepository;
        }

        public async Task<JobDto?> GetJobByIdAsync(int id)
        {
            var job = await _jobRepository.GetByIdAsync(id);
            if (job == null) return null;

            var applicationCount = await _applicationRepository.GetApplicationCountByJobAsync(id);
            return MapToDto(job, applicationCount);
        }

        public async Task<IEnumerable<JobDto>> GetAllJobsAsync()
        {
            var jobs = await _jobRepository.GetAllAsync();
            var jobDtos = new List<JobDto>();

            foreach (var job in jobs)
            {
                var applicationCount = await _applicationRepository.GetApplicationCountByJobAsync(job.Id);
                jobDtos.Add(MapToDto(job, applicationCount));
            }

            return jobDtos;
        }

        public async Task<JobDto> CreateJobAsync(int userId, CreateJobDto createDto)
        {
            // Get user's company
            var company = await _companyRepository.GetByUserIdAsync(userId);
            if (company == null)
            {
                throw new ArgumentException("Company profile not found. Please create a company profile first.");
            }

            var job = new Job
            {
                Title = createDto.Title,
                Description = createDto.Description,
                Requirements = createDto.Requirements,
                Location = createDto.Location,
                MinSalary = createDto.MinSalary,
                MaxSalary = createDto.MaxSalary,
                JobType = createDto.JobType,
                ExperienceLevel = createDto.ExperienceLevel,
                Category = createDto.Category,
                ApplicationDeadline = createDto.ApplicationDeadline,
                PostedByUserId = userId,
                CompanyId = company.Id,
                PostedDate = DateTime.UtcNow,
                IsActive = true
            };

            var createdJob = await _jobRepository.CreateAsync(job);
            return MapToDto(createdJob, 0);
        }

        public async Task<JobDto> UpdateJobAsync(int jobId, int userId, CreateJobDto updateDto)
        {
            var job = await _jobRepository.GetByIdAsync(jobId);
            if (job == null)
            {
                throw new ArgumentException("Job not found");
            }

            if (job.PostedByUserId != userId)
            {
                throw new UnauthorizedAccessException("You can only update your own job postings");
            }

            // Update job properties
            job.Title = updateDto.Title;
            job.Description = updateDto.Description;
            job.Requirements = updateDto.Requirements;
            job.Location = updateDto.Location;
            job.MinSalary = updateDto.MinSalary;
            job.MaxSalary = updateDto.MaxSalary;
            job.JobType = updateDto.JobType;
            job.ExperienceLevel = updateDto.ExperienceLevel;
            job.Category = updateDto.Category;
            job.ApplicationDeadline = updateDto.ApplicationDeadline;

            var updatedJob = await _jobRepository.UpdateAsync(job);
            var applicationCount = await _applicationRepository.GetApplicationCountByJobAsync(jobId);
            return MapToDto(updatedJob, applicationCount);
        }

        public async Task<bool> DeleteJobAsync(int jobId, int userId)
        {
            var job = await _jobRepository.GetByIdAsync(jobId);
            if (job == null) return false;

            if (job.PostedByUserId != userId)
            {
                throw new UnauthorizedAccessException("You can only delete your own job postings");
            }

            return await _jobRepository.DeleteAsync(jobId);
        }

        public async Task<IEnumerable<JobDto>> SearchJobsAsync(JobSearchDto searchDto)
        {
            var jobs = await _jobRepository.SearchJobsAsync(searchDto);
            var jobDtos = new List<JobDto>();

            foreach (var job in jobs)
            {
                var applicationCount = await _applicationRepository.GetApplicationCountByJobAsync(job.Id);
                jobDtos.Add(MapToDto(job, applicationCount));
            }

            return jobDtos;
        }

        public async Task<IEnumerable<JobDto>> GetJobsByUserAsync(int userId)
        {
            var jobs = await _jobRepository.GetJobsByUserAsync(userId);
            var jobDtos = new List<JobDto>();

            foreach (var job in jobs)
            {
                var applicationCount = await _applicationRepository.GetApplicationCountByJobAsync(job.Id);
                jobDtos.Add(MapToDto(job, applicationCount));
            }

            return jobDtos;
        }

        public async Task<IEnumerable<JobDto>> GetJobsByCompanyAsync(int companyId)
        {
            var jobs = await _jobRepository.GetJobsByCompanyAsync(companyId);
            var jobDtos = new List<JobDto>();

            foreach (var job in jobs)
            {
                var applicationCount = await _applicationRepository.GetApplicationCountByJobAsync(job.Id);
                jobDtos.Add(MapToDto(job, applicationCount));
            }

            return jobDtos;
        }

        public async Task<int> GetTotalJobsCountAsync()
        {
            return await _jobRepository.GetTotalCountAsync();
        }

        private JobDto MapToDto(Job job, int applicationCount)
        {
            return new JobDto
            {
                Id = job.Id,
                Title = job.Title,
                Description = job.Description,
                Requirements = job.Requirements,
                Location = job.Location,
                MinSalary = job.MinSalary,
                MaxSalary = job.MaxSalary,
                JobType = job.JobType,
                ExperienceLevel = job.ExperienceLevel,
                Category = job.Category,
                IsActive = job.IsActive,
                PostedDate = job.PostedDate,
                ApplicationDeadline = job.ApplicationDeadline,
                CompanyName = job.Company?.Name ?? "",
                CompanyLocation = job.Company?.Location ?? "",
                ApplicationCount = applicationCount
            };
        }
    }
}
