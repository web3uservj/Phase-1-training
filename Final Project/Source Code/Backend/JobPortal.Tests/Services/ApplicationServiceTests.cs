using JobPortal.Core.DTOs;
using JobPortal.Core.Entities;
using JobPortal.Core.Interfaces;
using JobPortal.Core.Services;
using Moq;
using NUnit.Framework;
using System;
using System.Threading.Tasks;

namespace JobPortal.Tests.Services
{
    [TestFixture]
    public class ApplicationServiceTests
    {
        private Mock<IApplicationRepository> _mockApplicationRepository;
        private Mock<IJobRepository> _mockJobRepository;
        private Mock<IUserRepository> _mockUserRepository;
        private ApplicationService _applicationService;

        [SetUp]
        public void Setup()
        {
            _mockApplicationRepository = new Mock<IApplicationRepository>();
            _mockJobRepository = new Mock<IJobRepository>();
            _mockUserRepository = new Mock<IUserRepository>();

            _applicationService = new ApplicationService(
                _mockApplicationRepository.Object,
                _mockJobRepository.Object,
                _mockUserRepository.Object);
        }

        [Test]
        public async Task CreateApplicationAsync_WithValidData_ShouldCreateApplication()
        {
            // Arrange
            var applicantId = 1;
            var createDto = new CreateApplicationDto
            {
                JobId = 1,
                CoverLetter = "I am very interested in this position"
            };

            var job = new Job
            {
                Id = 1,
                Title = "Software Developer",
                IsActive = true,
                ApplicationDeadline = DateTime.UtcNow.AddDays(7),
                Company = new Company { Name = "Tech Corp" }
            };

            var applicant = new User
            {
                Id = applicantId,
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                Role = UserRole.JobSeeker
            };

            var createdApplication = new JobApplication
            {
                Id = 1,
                JobId = createDto.JobId,
                ApplicantId = applicantId,
                CoverLetter = createDto.CoverLetter,
                Status = ApplicationStatus.Applied,
                AppliedDate = DateTime.UtcNow,
                Job = job,
                Applicant = applicant
            };

            _mockJobRepository.Setup(x => x.GetByIdAsync(createDto.JobId))
                .ReturnsAsync(job);

            _mockUserRepository.Setup(x => x.GetByIdAsync(applicantId))
                .ReturnsAsync(applicant);

            _mockApplicationRepository.Setup(x => x.HasAppliedAsync(createDto.JobId, applicantId))
                .ReturnsAsync(false);

            _mockApplicationRepository.Setup(x => x.CreateAsync(It.IsAny<JobApplication>()))
                .ReturnsAsync(createdApplication);

            _mockApplicationRepository.Setup(x => x.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(createdApplication);

            // Act
            var result = await _applicationService.CreateApplicationAsync(applicantId, createDto);

            // Assert
            Assert.NotNull(result);
            Assert.AreEqual(createDto.JobId, result.JobId);
            Assert.AreEqual(applicantId, result.ApplicantId);
            Assert.AreEqual(createDto.CoverLetter, result.CoverLetter);
            Assert.AreEqual(ApplicationStatus.Applied, result.Status);
            Assert.AreEqual(job.Title, result.JobTitle);
            Assert.AreEqual($"{applicant.FirstName} {applicant.LastName}", result.ApplicantName);

            _mockJobRepository.Verify(x => x.GetByIdAsync(createDto.JobId), Times.Once);
            _mockUserRepository.Verify(x => x.GetByIdAsync(applicantId), Times.Once);
            _mockApplicationRepository.Verify(x => x.HasAppliedAsync(createDto.JobId, applicantId), Times.Once);
            _mockApplicationRepository.Verify(x => x.CreateAsync(It.IsAny<JobApplication>()), Times.Once);
        }

        [Test]
        public void CreateApplicationAsync_WithInactiveJob_ShouldThrowException()
        {
            // Arrange
            var applicantId = 1;
            var createDto = new CreateApplicationDto
            {
                JobId = 1,
                CoverLetter = "I am interested"
            };

            var job = new Job
            {
                Id = 1,
                Title = "Software Developer",
                IsActive = false
            };

            _mockJobRepository.Setup(x => x.GetByIdAsync(createDto.JobId))
                .ReturnsAsync(job);

            // Act & Assert
            var ex = Assert.ThrowsAsync<ArgumentException>(async () =>
                await _applicationService.CreateApplicationAsync(applicantId, createDto));

            Assert.AreEqual("Job not found or is no longer active", ex.Message);
            _mockJobRepository.Verify(x => x.GetByIdAsync(createDto.JobId), Times.Once);
            _mockApplicationRepository.Verify(x => x.CreateAsync(It.IsAny<JobApplication>()), Times.Never);
        }

        [Test]
        public void CreateApplicationAsync_WithExpiredDeadline_ShouldThrowException()
        {
            var applicantId = 1;
            var createDto = new CreateApplicationDto
            {
                JobId = 1,
                CoverLetter = "I am interested"
            };

            var job = new Job
            {
                Id = 1,
                Title = "Software Developer",
                IsActive = true,
                ApplicationDeadline = DateTime.UtcNow.AddDays(-1)
            };

            _mockJobRepository.Setup(x => x.GetByIdAsync(createDto.JobId))
                .ReturnsAsync(job);

            var ex = Assert.ThrowsAsync<InvalidOperationException>(async () =>
                await _applicationService.CreateApplicationAsync(applicantId, createDto));

            Assert.AreEqual("Application deadline has passed", ex.Message);
            _mockJobRepository.Verify(x => x.GetByIdAsync(createDto.JobId), Times.Once);
            _mockApplicationRepository.Verify(x => x.CreateAsync(It.IsAny<JobApplication>()), Times.Never);
        }

        [Test]
        public void CreateApplicationAsync_WithDuplicateApplication_ShouldThrowException()
        {
            var applicantId = 1;
            var createDto = new CreateApplicationDto
            {
                JobId = 1,
                CoverLetter = "I am interested"
            };

            var job = new Job
            {
                Id = 1,
                Title = "Software Developer",
                IsActive = true,
                ApplicationDeadline = DateTime.UtcNow.AddDays(7)
            };

            var applicant = new User
            {
                Id = applicantId,
                Role = UserRole.JobSeeker
            };

            _mockJobRepository.Setup(x => x.GetByIdAsync(createDto.JobId))
                .ReturnsAsync(job);

            _mockUserRepository.Setup(x => x.GetByIdAsync(applicantId))
                .ReturnsAsync(applicant);

            _mockApplicationRepository.Setup(x => x.HasAppliedAsync(createDto.JobId, applicantId))
                .ReturnsAsync(true);

            var ex = Assert.ThrowsAsync<InvalidOperationException>(async () =>
                await _applicationService.CreateApplicationAsync(applicantId, createDto));

            Assert.AreEqual("You have already applied for this job", ex.Message);
            _mockApplicationRepository.Verify(x => x.HasAppliedAsync(createDto.JobId, applicantId), Times.Once);
            _mockApplicationRepository.Verify(x => x.CreateAsync(It.IsAny<JobApplication>()), Times.Never);
        }

        // Similarly, convert all other [Fact] tests to [Test] and Assert.ThrowsAsync for NUnit
    }
}
