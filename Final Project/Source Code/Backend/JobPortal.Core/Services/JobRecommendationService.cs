using JobPortal.Core.DTOs;
using JobPortal.Core.Entities;
using JobPortal.Core.Interfaces;

namespace JobPortal.Core.Services
{
    public class JobRecommendationService : IJobRecommendationService
    {
        private readonly IJobRepository _jobRepository;
        private readonly IJobSeekerProfileRepository _profileRepository;
        private readonly IApplicationRepository _applicationRepository;
        private readonly ICacheService _cacheService;

        public JobRecommendationService(
            IJobRepository jobRepository,
            IJobSeekerProfileRepository profileRepository,
            IApplicationRepository applicationRepository,
            ICacheService cacheService)
        {
            _jobRepository = jobRepository;
            _profileRepository = profileRepository;
            _applicationRepository = applicationRepository;
            _cacheService = cacheService;
        }

        public async Task<IEnumerable<JobDto>> GetRecommendedJobsAsync(int userId, int count = 10)
        {
            var cacheKey = $"recommended_jobs_{userId}_{count}";
            
            return await _cacheService.GetOrSetAsync(cacheKey, async () =>
            {
                // Get user's profile and application history
                var profile = await _profileRepository.GetByUserIdAsync(userId);
                var applications = await _applicationRepository.GetByApplicantIdAsync(userId);
                
                if (profile == null)
                    return new List<JobDto>();

                // Get all active jobs
                var allJobs = await _jobRepository.GetAllAsync();
                var activeJobs = allJobs.Where(j => j.IsActive).ToList();

                // Score jobs based on profile match
                var scoredJobs = new List<(Job job, double score)>();

                foreach (var job in activeJobs)
                {
                    // Skip jobs user already applied to
                    if (applications.Any(a => a.JobId == job.Id))
                        continue;

                    var score = CalculateJobMatchScore(profile, job);
                    scoredJobs.Add((job, score));
                }

                // Return top scored jobs
                var recommendedJobs = scoredJobs
                    .OrderByDescending(x => x.score)
                    .Take(count)
                    .Select(x => MapJobToDto(x.job))
                    .ToList();

                return recommendedJobs;
            }, TimeSpan.FromMinutes(15));
        }

        public async Task<IEnumerable<JobDto>> GetSimilarJobsAsync(int jobId, int count = 5)
        {
            var cacheKey = $"similar_jobs_{jobId}_{count}";
            
            return await _cacheService.GetOrSetAsync(cacheKey, async () =>
            {
                var targetJob = await _jobRepository.GetByIdAsync(jobId);
                if (targetJob == null)
                    return new List<JobDto>();

                var allJobs = await _jobRepository.GetAllAsync();
                var otherJobs = allJobs.Where(j => j.Id != jobId && j.IsActive).ToList();

                var similarJobs = otherJobs
                    .Select(job => new { Job = job, Similarity = CalculateJobSimilarity(targetJob, job) })
                    .OrderByDescending(x => x.Similarity)
                    .Take(count)
                    .Select(x => MapJobToDto(x.Job))
                    .ToList();

                return similarJobs;
            }, TimeSpan.FromMinutes(30));
        }

        public async Task<IEnumerable<JobSeekerProfileDto>> GetRecommendedCandidatesAsync(int jobId, int count = 10)
        {
            var cacheKey = $"recommended_candidates_{jobId}_{count}";
            
            return await _cacheService.GetOrSetAsync(cacheKey, async () =>
            {
                var job = await _jobRepository.GetByIdAsync(jobId);
                if (job == null)
                    return new List<JobSeekerProfileDto>();

                var allProfiles = await _profileRepository.GetAllAsync();
                var applications = await _applicationRepository.GetByJobIdAsync(jobId);
                var appliedUserIds = applications.Select(a => a.ApplicantId).ToHashSet();

                // Filter out users who already applied
                var availableProfiles = allProfiles
                    .Where(p => !appliedUserIds.Contains(p.UserId))
                    .ToList();

                var scoredProfiles = availableProfiles
                    .Select(profile => new { Profile = profile, Score = CalculateCandidateMatchScore(job, profile) })
                    .OrderByDescending(x => x.Score)
                    .Take(count)
                    .Select(x => MapProfileToDto(x.Profile))
                    .ToList();

                return scoredProfiles;
            }, TimeSpan.FromMinutes(20));
        }

        private double CalculateJobMatchScore(JobSeekerProfile profile, Job job)
        {
            double score = 0;

            // Location match (30% weight)
            if (!string.IsNullOrEmpty(profile.Location) && !string.IsNullOrEmpty(job.Location))
            {
                if (profile.Location.Contains(job.Location, StringComparison.OrdinalIgnoreCase) ||
                    job.Location.Contains(profile.Location, StringComparison.OrdinalIgnoreCase))
                {
                    score += 30;
                }
            }

            // Skills match (40% weight)
            if (!string.IsNullOrEmpty(profile.Skills) && !string.IsNullOrEmpty(job.Requirements))
            {
                var profileSkills = profile.Skills.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(s => s.Trim().ToLower()).ToHashSet();
                var jobRequirements = job.Requirements.ToLower();

                var matchingSkills = profileSkills.Count(skill => jobRequirements.Contains(skill));
                var skillMatchPercentage = profileSkills.Count > 0 ? (double)matchingSkills / profileSkills.Count : 0;
                score += skillMatchPercentage * 40;
            }

            // Salary match (20% weight)
            if (profile.ExpectedSalary.HasValue && job.MinSalary.HasValue && job.MaxSalary.HasValue)
            {
                if (profile.ExpectedSalary >= job.MinSalary && profile.ExpectedSalary <= job.MaxSalary)
                {
                    score += 20;
                }
                else if (Math.Abs(profile.ExpectedSalary.Value - ((job.MinSalary.Value + job.MaxSalary.Value) / 2)) < 10000)
                {
                    score += 10; // Partial match if within 10k range
                }
            }

            // Experience level match (10% weight)
            // This would require additional logic based on profile experience vs job requirements

            return score;
        }

        private double CalculateJobSimilarity(Job job1, Job job2)
        {
            double similarity = 0;

            // Same job type (25% weight)
            if (job1.JobType == job2.JobType)
                similarity += 25;

            // Same experience level (25% weight)
            if (job1.ExperienceLevel == job2.ExperienceLevel)
                similarity += 25;

            // Same category (20% weight)
            if (!string.IsNullOrEmpty(job1.Category) && !string.IsNullOrEmpty(job2.Category) &&
                job1.Category.Equals(job2.Category, StringComparison.OrdinalIgnoreCase))
                similarity += 20;

            // Similar location (15% weight)
            if (!string.IsNullOrEmpty(job1.Location) && !string.IsNullOrEmpty(job2.Location) &&
                job1.Location.Equals(job2.Location, StringComparison.OrdinalIgnoreCase))
                similarity += 15;

            // Similar salary range (15% weight)
           // Similar salary range (15% weight)
if (job1.MinSalary.HasValue && job1.MaxSalary.HasValue &&
    job2.MinSalary.HasValue && job2.MaxSalary.HasValue)
{
    var range1 = (double)(job1.MaxSalary.Value - job1.MinSalary.Value);
    var range2 = (double)(job2.MaxSalary.Value - job2.MinSalary.Value);
    var overlap = (double)(Math.Max(0, Math.Min(job1.MaxSalary.Value, job2.MaxSalary.Value) -
                                     Math.Max(job1.MinSalary.Value, job2.MinSalary.Value)));

    if (overlap > 0)
    {
        var overlapPercentage = overlap / Math.Max(range1, range2); // now double ÷ double
        similarity += overlapPercentage * 15; // ✅ no type conflict
    }
}


            return similarity;
        }

        private double CalculateCandidateMatchScore(Job job, JobSeekerProfile profile)
        {
            // This is the inverse of CalculateJobMatchScore
            return CalculateJobMatchScore(profile, job);
        }

        private JobDto MapJobToDto(Job job)
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
                ApplicationCount = job.Applications?.Count ?? 0
            };
        }

        private JobSeekerProfileDto MapProfileToDto(JobSeekerProfile profile)
        {
            return new JobSeekerProfileDto
            {
                Id = profile.Id,
                UserId = profile.UserId,
                Summary = profile.Summary,
                Skills = profile.Skills,
                Education = profile.Education,
                Experience = profile.Experience,
                Location = profile.Location,
                ExpectedSalary = profile.ExpectedSalary,
                CreatedAt = profile.CreatedAt,
                UpdatedAt = profile.UpdatedAt
            };
        }
    }
}
