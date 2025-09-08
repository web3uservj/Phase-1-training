using JobPortal.Core.DTOs;
using JobPortal.Core.Entities;
using JobPortal.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.Core.Services
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJobRepository _jobRepository;
        private readonly IApplicationRepository _applicationRepository;
        private readonly ICompanyRepository _companyRepository;

        public AdminService(
            IUserRepository userRepository,
            IJobRepository jobRepository,
            IApplicationRepository applicationRepository,
            ICompanyRepository companyRepository)
        {
            _userRepository = userRepository;
            _jobRepository = jobRepository;
            _applicationRepository = applicationRepository;
            _companyRepository = companyRepository;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var allUsers = await _userRepository.GetAllAsync();
            var allJobs = await _jobRepository.GetAllAsync();
            var allApplications = await _applicationRepository.GetAllAsync();
            var allCompanies = await _companyRepository.GetAllAsync();

            var totalUsers = allUsers.Count();
            var totalJobSeekers = allUsers.Count(u => u.Role == UserRole.JobSeeker);
            var totalEmployers = allUsers.Count(u => u.Role == UserRole.Employer);
            var totalJobs = allJobs.Count();
            var activeJobs = allJobs.Count(j => j.IsActive);
            var totalApplications = allApplications.Count();
            var totalCompanies = allCompanies.Count();

            var hiredApplications = allApplications.Count(a => a.Status == ApplicationStatus.Hired);
            var applicationSuccessRate = totalApplications > 0 ? (decimal)hiredApplications / totalApplications * 100 : 0;

            // Monthly stats for the last 12 months
            var monthlyStats = new List<MonthlyStatsDto>();
            for (int i = 11; i >= 0; i--)
            {
                var date = DateTime.UtcNow.AddMonths(-i);
                var startOfMonth = new DateTime(date.Year, date.Month, 1);
                var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

                var newUsers = allUsers.Count(u => u.CreatedAt >= startOfMonth && u.CreatedAt <= endOfMonth);
                var newJobs = allJobs.Count(j => j.PostedDate >= startOfMonth && j.PostedDate <= endOfMonth);
                var newApplications = allApplications.Count(a => a.AppliedDate >= startOfMonth && a.AppliedDate <= endOfMonth);

                monthlyStats.Add(new MonthlyStatsDto
                {
                    Month = date.Month,
                    Year = date.Year,
                    MonthName = date.ToString("MMM yyyy"),
                    NewUsers = newUsers,
                    NewJobs = newJobs,
                    NewApplications = newApplications
                });
            }

            // Job category stats
            var jobCategoryStats = allJobs
                .Where(j => !string.IsNullOrEmpty(j.Category))
                .GroupBy(j => j.Category)
                .Select(g => new JobCategoryStatsDto
                {
                    Category = g.Key!,
                    JobCount = g.Count(),
                    ApplicationCount = g.SelectMany(j => j.Applications).Count()
                })
                .OrderByDescending(s => s.JobCount)
                .Take(10)
                .ToList();

            // Top companies
            var topCompanies = allCompanies
                .Select(c => new TopCompanyDto
                {
                    CompanyId = c.Id,
                    CompanyName = c.Name,
                    JobCount = c.Jobs.Count(),
                    ApplicationCount = c.Jobs.SelectMany(j => j.Applications).Count()
                })
                .OrderByDescending(c => c.JobCount)
                .Take(10)
                .ToList();

            return new DashboardStatsDto
            {
                TotalUsers = totalUsers,
                TotalJobSeekers = totalJobSeekers,
                TotalEmployers = totalEmployers,
                TotalJobs = totalJobs,
                ActiveJobs = activeJobs,
                TotalApplications = totalApplications,
                TotalCompanies = totalCompanies,
                ApplicationSuccessRate = applicationSuccessRate,
                MonthlyStats = monthlyStats,
                JobCategoryStats = jobCategoryStats,
                TopCompanies = topCompanies
            };
        }

        public async Task<IEnumerable<UserManagementDto>> GetAllUsersForManagementAsync()
        {
            var users = await _userRepository.GetAllAsync();
            var userDtos = new List<UserManagementDto>();

            foreach (var user in users)
            {
                var dto = new UserManagementDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Role = user.Role,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt
                };

                if (user.Role == UserRole.Employer)
                {
                    dto.JobPostCount = user.PostedJobs.Count();
                    dto.CompanyName = user.Company?.Name;
                }
                else if (user.Role == UserRole.JobSeeker)
                {
                    dto.ApplicationCount = user.Applications.Count();
                }

                userDtos.Add(dto);
            }

            return userDtos.OrderByDescending(u => u.CreatedAt);
        }

        public async Task<UserManagementDto> UpdateUserStatusAsync(int userId, UpdateUserStatusDto updateDto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }

            user.IsActive = updateDto.IsActive;
            await _userRepository.UpdateAsync(user);

            return new UserManagementDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                JobPostCount = user.Role == UserRole.Employer ? user.PostedJobs.Count() : null,
                ApplicationCount = user.Role == UserRole.JobSeeker ? user.Applications.Count() : null,
                CompanyName = user.Company?.Name
            };
        }

        public async Task<bool> DeleteUserAsync(int userId)
        {
            return await _userRepository.DeleteAsync(userId);
        }

        public async Task<IEnumerable<JobModerationDto>> GetJobsForModerationAsync()
        {
            var jobs = await _jobRepository.GetAllAsync();
            
            return jobs.Select(j => new JobModerationDto
            {
                Id = j.Id,
                Title = j.Title,
                Description = j.Description.Length > 200 ? j.Description.Substring(0, 200) + "..." : j.Description,
                CompanyName = j.Company?.Name ?? "",
                PostedByName = $"{j.PostedBy?.FirstName} {j.PostedBy?.LastName}",
                PostedDate = j.PostedDate,
                IsActive = j.IsActive,
                ApplicationCount = j.Applications.Count(),
                RequiresReview = j.PostedDate > DateTime.UtcNow.AddDays(-7) // Jobs posted in last 7 days
            }).OrderByDescending(j => j.PostedDate);
        }

        public async Task<bool> ApproveJobAsync(int jobId)
        {
            var job = await _jobRepository.GetByIdAsync(jobId);
            if (job == null) return false;

            job.IsActive = true;
            await _jobRepository.UpdateAsync(job);
            return true;
        }

        public async Task<bool> RejectJobAsync(int jobId, string reason)
        {
            var job = await _jobRepository.GetByIdAsync(jobId);
            if (job == null) return false;

            job.IsActive = false;
            await _jobRepository.UpdateAsync(job);
            return true;
        }

        public async Task<ReportDto> GenerateUserReportAsync(DateTime startDate, DateTime endDate)
        {
            var users = await _userRepository.GetAllAsync();
            var filteredUsers = users.Where(u => u.CreatedAt >= startDate && u.CreatedAt <= endDate);

            var data = new Dictionary<string, object>
            {
                ["TotalUsers"] = filteredUsers.Count(),
                ["JobSeekers"] = filteredUsers.Count(u => u.Role == UserRole.JobSeeker),
                ["Employers"] = filteredUsers.Count(u => u.Role == UserRole.Employer),
                ["ActiveUsers"] = filteredUsers.Count(u => u.IsActive),
                ["InactiveUsers"] = filteredUsers.Count(u => !u.IsActive),
                ["UsersByMonth"] = filteredUsers
                    .GroupBy(u => new { u.CreatedAt.Year, u.CreatedAt.Month })
                    .Select(g => new { 
                        Month = $"{g.Key.Year}-{g.Key.Month:D2}", 
                        Count = g.Count() 
                    })
                    .OrderBy(x => x.Month)
                    .ToList()
            };

            return new ReportDto
            {
                ReportType = "User Report",
                GeneratedAt = DateTime.UtcNow,
                Data = data
            };
        }

        public async Task<ReportDto> GenerateJobReportAsync(DateTime startDate, DateTime endDate)
        {
            var jobs = await _jobRepository.GetAllAsync();
            var filteredJobs = jobs.Where(j => j.PostedDate >= startDate && j.PostedDate <= endDate);

            var data = new Dictionary<string, object>
            {
                ["TotalJobs"] = filteredJobs.Count(),
                ["ActiveJobs"] = filteredJobs.Count(j => j.IsActive),
                ["InactiveJobs"] = filteredJobs.Count(j => !j.IsActive),
                ["JobsByType"] = filteredJobs
                    .GroupBy(j => j.JobType)
                    .Select(g => new { Type = g.Key.ToString(), Count = g.Count() })
                    .ToList(),
                ["JobsByExperience"] = filteredJobs
                    .GroupBy(j => j.ExperienceLevel)
                    .Select(g => new { Level = g.Key.ToString(), Count = g.Count() })
                    .ToList(),
                ["JobsByCategory"] = filteredJobs
                    .Where(j => !string.IsNullOrEmpty(j.Category))
                    .GroupBy(j => j.Category)
                    .Select(g => new { Category = g.Key, Count = g.Count() })
                    .OrderByDescending(x => x.Count)
                    .Take(10)
                    .ToList()
            };

            return new ReportDto
            {
                ReportType = "Job Report",
                GeneratedAt = DateTime.UtcNow,
                Data = data
            };
        }

        public async Task<ReportDto> GenerateApplicationReportAsync(DateTime startDate, DateTime endDate)
        {
            var applications = await _applicationRepository.GetAllAsync();
            var filteredApplications = applications.Where(a => a.AppliedDate >= startDate && a.AppliedDate <= endDate);

            var data = new Dictionary<string, object>
            {
                ["TotalApplications"] = filteredApplications.Count(),
                ["ApplicationsByStatus"] = filteredApplications
                    .GroupBy(a => a.Status)
                    .Select(g => new { Status = g.Key.ToString(), Count = g.Count() })
                    .ToList(),
                ["SuccessRate"] = filteredApplications.Any() ? 
                    (decimal)filteredApplications.Count(a => a.Status == ApplicationStatus.Hired) / filteredApplications.Count() * 100 : 0,
                ["AverageApplicationsPerJob"] = filteredApplications.Any() ?
                    filteredApplications.GroupBy(a => a.JobId).Average(g => g.Count()) : 0,
                ["ApplicationsByMonth"] = filteredApplications
                    .GroupBy(a => new { a.AppliedDate.Year, a.AppliedDate.Month })
                    .Select(g => new { 
                        Month = $"{g.Key.Year}-{g.Key.Month:D2}", 
                        Count = g.Count() 
                    })
                    .OrderBy(x => x.Month)
                    .ToList()
            };

            return new ReportDto
            {
                ReportType = "Application Report",
                GeneratedAt = DateTime.UtcNow,
                Data = data
            };
        }

        public async Task<IEnumerable<SystemActivityDto>> GetSystemActivityAsync(int days = 30)
        {
            var startDate = DateTime.UtcNow.AddDays(-days);
            var activities = new List<SystemActivityDto>();

            // Get recent users
            var recentUsers = await _userRepository.GetAllAsync();
            var newUsers = recentUsers.Where(u => u.CreatedAt >= startDate);

            foreach (var user in newUsers)
            {
                activities.Add(new SystemActivityDto
                {
                    Date = user.CreatedAt,
                    ActivityType = "User Registration",
                    Description = $"New {user.Role} registered",
                    UserEmail = user.Email,
                    UserRole = user.Role.ToString()
                });
            }

            // Get recent jobs
            var recentJobs = await _jobRepository.GetAllAsync();
            var newJobs = recentJobs.Where(j => j.PostedDate >= startDate);

            foreach (var job in newJobs)
            {
                activities.Add(new SystemActivityDto
                {
                    Date = job.PostedDate,
                    ActivityType = "Job Posted",
                    Description = $"Job '{job.Title}' posted",
                    UserEmail = job.PostedBy?.Email ?? "",
                    UserRole = "Employer"
                });
            }

            // Get recent applications
            var recentApplications = await _applicationRepository.GetAllAsync();
            var newApplications = recentApplications.Where(a => a.AppliedDate >= startDate);

            foreach (var application in newApplications)
            {
                activities.Add(new SystemActivityDto
                {
                    Date = application.AppliedDate,
                    ActivityType = "Job Application",
                    Description = $"Application submitted for '{application.Job?.Title}'",
                    UserEmail = application.Applicant?.Email ?? "",
                    UserRole = "JobSeeker"
                });
            }

            return activities.OrderByDescending(a => a.Date).Take(100);
        }
    }
}
