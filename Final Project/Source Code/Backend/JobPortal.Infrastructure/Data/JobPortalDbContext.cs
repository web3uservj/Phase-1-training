using JobPortal.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.Infrastructure.Data
{
    public class JobPortalDbContext : DbContext
    {
        public JobPortalDbContext(DbContextOptions<JobPortalDbContext> options) : base(options)
        {
        }
        
        public DbSet<User> Users { get; set; }
        public DbSet<JobSeekerProfile> JobSeekerProfiles { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<JobApplication> JobApplications { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // User Configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PhoneNumber).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Role).HasConversion<int>();
            });
            
            // JobSeekerProfile Configuration
            modelBuilder.Entity<JobSeekerProfile>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.User)
                      .WithOne(u => u.JobSeekerProfile)
                      .HasForeignKey<JobSeekerProfile>(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.Property(e => e.ExpectedSalary).HasColumnType("decimal(18,2)");
            });
            
            // Company Configuration
            modelBuilder.Entity<Company>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.User)
                      .WithOne(u => u.Company)
                      .HasForeignKey<Company>(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            });
            
            // Job Configuration
            modelBuilder.Entity<Job>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.PostedBy)
                      .WithMany(u => u.PostedJobs)
                      .HasForeignKey(e => e.PostedByUserId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Company)
                      .WithMany(c => c.Jobs)
                      .HasForeignKey(e => e.CompanyId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.Requirements).IsRequired();
                entity.Property(e => e.MinSalary).HasColumnType("decimal(18,2)");
                entity.Property(e => e.MaxSalary).HasColumnType("decimal(18,2)");
                entity.Property(e => e.JobType).HasConversion<int>();
                entity.Property(e => e.ExperienceLevel).HasConversion<int>();
            });
            
            // JobApplication Configuration
            modelBuilder.Entity<JobApplication>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Job)
                      .WithMany(j => j.Applications)
                      .HasForeignKey(e => e.JobId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Applicant)
                      .WithMany(u => u.Applications)
                      .HasForeignKey(e => e.ApplicantId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.Property(e => e.Status).HasConversion<int>();
                
                // Ensure unique application per job per user
                entity.HasIndex(e => new { e.JobId, e.ApplicantId }).IsUnique();
            });
        }
    }
}
