using JobPortal.Core.DTOs;
using JobPortal.Core.Entities;
using JobPortal.Core.Interfaces;
using JobPortal.Core.Services;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortal.Tests.Services
{
    [TestFixture]
    public class JobServiceTests
    {
        private Mock<IJobRepository> _mockJobRepository;
        private Mock<ICompanyRepository> _mockCompanyRepository;
        private Mock<IApplicationRepository> _mockApplicationRepository;
        private JobService _jobService;

        [SetUp]
        public void Setup()
        {
            _mockJobRepository = new Mock<IJobRepository>();
            _mockCompanyRepository = new Mock<ICompanyRepository>();
            _mockApplicationRepository = new Mock<IApplicationRepository>();

            _jobService = new JobService(
                _mockJobRepository.Object,
                _mockCompanyRepository.Object,
                _mockApplicationRepository.Object);
        }

        [Test]
        public async Task CreateJobAsync_WithValidData_ShouldCreateJob()
        {
            var userId = 1;
            var createJobDto = new CreateJobDto
            {
                Title = "Software Developer",
                Description = "We are looking for a skilled software developer",
                Requirements = "3+ years experience in .NET",
                Location = "New York",
                JobType = JobType.FullTime,
                ExperienceLevel = ExperienceLevel.MidLevel,
                MinSalary = 70000,
                MaxSalary = 90000
            };

            var company = new Company
            {
                Id = 1,
                UserId = userId,
                Name = "Tech Corp",
                Location = "New York"
            };

            var createdJob = new Job
            {
                Id = 1,
                Title = createJobDto.Title,
                Description = createJobDto.Description,
                Requirements = createJobDto.Requirements,
                Location = createJobDto.Location,
                JobType = createJobDto.JobType,
                ExperienceLevel = createJobDto.ExperienceLevel,
                MinSalary = createJobDto.MinSalary,
                MaxSalary = createJobDto.MaxSalary,
                PostedByUserId = userId,
                CompanyId = company.Id,
                Company = company,
                IsActive = true,
                PostedDate = DateTime.UtcNow
            };

            _mockCompanyRepository.Setup(x => x.GetByUserIdAsync(userId))
                .ReturnsAsync(company);

            _mockJobRepository.Setup(x => x.CreateAsync(It.IsAny<Job>()))
                .ReturnsAsync(createdJob);

            _mockApplicationRepository.Setup(x => x.GetApplicationCountByJobAsync(It.IsAny<int>()))
                .ReturnsAsync(0);

            var result = await _jobService.CreateJobAsync(userId, createJobDto);

            Assert.NotNull(result);
            Assert.AreEqual(createJobDto.Title, result.Title);
            Assert.AreEqual(createJobDto.Description, result.Description);
            Assert.AreEqual(company.Name, result.CompanyName);
            Assert.AreEqual(0, result.ApplicationCount);

            _mockCompanyRepository.Verify(x => x.GetByUserIdAsync(userId), Times.Once);
            _mockJobRepository.Verify(x => x.CreateAsync(It.IsAny<Job>()), Times.Once);
        }

        [Test]
        public void CreateJobAsync_WithoutCompany_ShouldThrowException()
        {
            var userId = 1;
            var createJobDto = new CreateJobDto
            {
                Title = "Software Developer",
                Description = "We are looking for a skilled software developer",
                Requirements = "3+ years experience in .NET"
            };

            _mockCompanyRepository.Setup(x => x.GetByUserIdAsync(userId))
                .ReturnsAsync((Company?)null);

            var ex = Assert.ThrowsAsync<ArgumentException>(async () =>
                await _jobService.CreateJobAsync(userId, createJobDto));

            Assert.AreEqual("Company profile not found. Please create a company profile first.", ex.Message);

            _mockCompanyRepository.Verify(x => x.GetByUserIdAsync(userId), Times.Once);
            _mockJobRepository.Verify(x => x.CreateAsync(It.IsAny<Job>()), Times.Never);
        }

        [Test]
        public async Task GetJobByIdAsync_WithValidId_ShouldReturnJob()
        {
            var jobId = 1;
            var job = new Job
            {
                Id = jobId,
                Title = "Software Developer",
                Description = "Great opportunity",
                Requirements = "3+ years experience",
                Location = "New York",
                JobType = JobType.FullTime,
                ExperienceLevel = ExperienceLevel.MidLevel,
                IsActive = true,
                PostedDate = DateTime.UtcNow,
                Company = new Company { Name = "Tech Corp", Location = "NYC" }
            };

            _mockJobRepository.Setup(x => x.GetByIdAsync(jobId))
                .ReturnsAsync(job);

            _mockApplicationRepository.Setup(x => x.GetApplicationCountByJobAsync(jobId))
                .ReturnsAsync(5);

            var result = await _jobService.GetJobByIdAsync(jobId);

            Assert.NotNull(result);
            Assert.AreEqual(job.Title, result.Title);
            Assert.AreEqual(job.Company.Name, result.CompanyName);
            Assert.AreEqual(5, result.ApplicationCount);

            _mockJobRepository.Verify(x => x.GetByIdAsync(jobId), Times.Once);
            _mockApplicationRepository.Verify(x => x.GetApplicationCountByJobAsync(jobId), Times.Once);
        }

        [Test]
        public void UpdateJobAsync_WithUnauthorizedUser_ShouldThrowException()
        {
            var jobId = 1;
            var userId = 2; // Different user
            var updateDto = new CreateJobDto
            {
                Title = "Updated Title",
                Description = "Updated description",
                Requirements = "Updated requirements"
            };

            var job = new Job
            {
                Id = jobId,
                PostedByUserId = 1, // Original poster
                Title = "Original Title"
            };

            _mockJobRepository.Setup(x => x.GetByIdAsync(jobId))
                .ReturnsAsync(job);

            var ex = Assert.ThrowsAsync<UnauthorizedAccessException>(async () =>
                await _jobService.UpdateJobAsync(jobId, userId, updateDto));

            Assert.AreEqual("You can only update your own job postings", ex.Message);

            _mockJobRepository.Verify(x => x.GetByIdAsync(jobId), Times.Once);
            _mockJobRepository.Verify(x => x.UpdateAsync(It.IsAny<Job>()), Times.Never);
        }

        [Test]
        public async Task SearchJobsAsync_WithFilters_ShouldReturnFilteredJobs()
        {
            var searchDto = new JobSearchDto
            {
                Title = "Developer",
                Location = "New York",
                JobType = JobType.FullTime,
                Page = 1,
                PageSize = 10
            };

            var jobs = new List<Job>
            {
                new Job
                {
                    Id = 1,
                    Title = "Software Developer",
                    Location = "New York",
                    JobType = JobType.FullTime,
                    Company = new Company { Name = "Tech Corp" },
                    IsActive = true
                },
                new Job
                {
                    Id = 2,
                    Title = "Frontend Developer",
                    Location = "New York",
                    JobType = JobType.FullTime,
                    Company = new Company { Name = "Web Corp" },
                    IsActive = true
                }
            };

            _mockJobRepository.Setup(x => x.SearchJobsAsync(searchDto))
                .ReturnsAsync(jobs);

            _mockApplicationRepository.Setup(x => x.GetApplicationCountByJobAsync(It.IsAny<int>()))
                .ReturnsAsync(3);

            var result = await _jobService.SearchJobsAsync(searchDto);

            Assert.NotNull(result);
            Assert.AreEqual(2, result.Count());
            Assert.IsTrue(result.All(job => job.ApplicationCount == 3));

            _mockJobRepository.Verify(x => x.SearchJobsAsync(searchDto), Times.Once);
        }
    }
}
