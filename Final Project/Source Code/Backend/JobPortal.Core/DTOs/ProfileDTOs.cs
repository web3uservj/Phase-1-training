using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace JobPortal.Core.DTOs
{
    public class JobSeekerProfileDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? Summary { get; set; }
        public string? Skills { get; set; }
        public string? Education { get; set; }
        public string? Experience { get; set; }
        public string? ResumeFileName { get; set; }
        public string? ResumeFilePath { get; set; }
        public string? Location { get; set; }
        public decimal? ExpectedSalary { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
    
    public class CreateJobSeekerProfileDto
    {
        [StringLength(500)]
        public string? Summary { get; set; }
        
        [StringLength(200)]
        public string? Skills { get; set; }
        
        [StringLength(200)]
        public string? Education { get; set; }
        
        [StringLength(500)]
        public string? Experience { get; set; }
        
        [StringLength(100)]
        public string? Location { get; set; }
        
        public decimal? ExpectedSalary { get; set; }
    }
    
    public class UpdateJobSeekerProfileDto
    {
        [StringLength(500)]
        public string? Summary { get; set; }
        
        [StringLength(200)]
        public string? Skills { get; set; }
        
        [StringLength(200)]
        public string? Education { get; set; }
        
        [StringLength(500)]
        public string? Experience { get; set; }
        
        [StringLength(100)]
        public string? Location { get; set; }
        
        public decimal? ExpectedSalary { get; set; }
    }
    
    public class CompanyDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? Industry { get; set; }
        public string? Location { get; set; }
        public string? Website { get; set; }
        public string? LogoFileName { get; set; }
        public string? LogoFilePath { get; set; }
        public int? EmployeeCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
    
    public class CreateCompanyDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; }
        
        [StringLength(1000)]
        public string? Description { get; set; }
        
        [StringLength(100)]
        public string? Industry { get; set; }
        
        [StringLength(200)]
        public string? Location { get; set; }
        
        [StringLength(255)]
        public string? Website { get; set; }
        
        public int? EmployeeCount { get; set; }
    }
    
    public class UpdateCompanyDto
    {
        [StringLength(200)]
        public string? Name { get; set; }
        
        [StringLength(1000)]
        public string? Description { get; set; }
        
        [StringLength(100)]
        public string? Industry { get; set; }
        
        [StringLength(200)]
        public string? Location { get; set; }
        
        [StringLength(255)]
        public string? Website { get; set; }
        
        public int? EmployeeCount { get; set; }
    }
    
    public class FileUploadResultDto
    {
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public long FileSize { get; set; }
    }
}
