using JobPortal.Core.DTOs;
using JobPortal.Core.Entities;
using JobPortal.Core.Interfaces;
using Microsoft.AspNetCore.Http;

namespace JobPortal.Core.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IUserRepository _userRepository;

        public CompanyService(ICompanyRepository companyRepository, IUserRepository userRepository)
        {
            _companyRepository = companyRepository;
            _userRepository = userRepository;
        }

        public async Task<CompanyDto?> GetCompanyByUserIdAsync(int userId)
        {
            var company = await _companyRepository.GetByUserIdAsync(userId);
            return company != null ? MapToDto(company) : null;
        }

        public async Task<CompanyDto?> GetCompanyByIdAsync(int id)
        {
            var company = await _companyRepository.GetByIdAsync(id);
            return company != null ? MapToDto(company) : null;
        }

        public async Task<IEnumerable<CompanyDto>> GetAllCompaniesAsync()
        {
            var companies = await _companyRepository.GetAllAsync();
            return companies.Select(MapToDto);
        }

        public async Task<CompanyDto> CreateCompanyAsync(int userId, CreateCompanyDto createDto)
        {
            // Verify user exists and is an employer
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null || user.Role != UserRole.Employer)
            {
                throw new ArgumentException("Invalid user or user is not an employer");
            }

            // Check if company already exists
            if (await _companyRepository.ExistsAsync(userId))
            {
                throw new InvalidOperationException("Company profile already exists for this user");
            }

            var company = new Company
            {
                UserId = userId,
                Name = createDto.Name,
                Description = createDto.Description,
                Industry = createDto.Industry,
                Location = createDto.Location,
                Website = createDto.Website,
                EmployeeCount = createDto.EmployeeCount,
                CreatedAt = DateTime.UtcNow
            };

            var createdCompany = await _companyRepository.CreateAsync(company);
            return MapToDto(createdCompany);
        }

        public async Task<CompanyDto> UpdateCompanyAsync(int userId, UpdateCompanyDto updateDto)
        {
            var company = await _companyRepository.GetByUserIdAsync(userId);
            if (company == null)
            {
                throw new ArgumentException("Company not found");
            }

            // Update only provided fields
            if (!string.IsNullOrEmpty(updateDto.Name))
                company.Name = updateDto.Name;
            
            if (updateDto.Description != null)
                company.Description = updateDto.Description;
            
            if (updateDto.Industry != null)
                company.Industry = updateDto.Industry;
            
            if (updateDto.Location != null)
                company.Location = updateDto.Location;
            
            if (updateDto.Website != null)
                company.Website = updateDto.Website;
            
            if (updateDto.EmployeeCount.HasValue)
                company.EmployeeCount = updateDto.EmployeeCount;

            var updatedCompany = await _companyRepository.UpdateAsync(company);
            return MapToDto(updatedCompany);
        }

        public async Task<bool> DeleteCompanyAsync(int userId)
        {
            var company = await _companyRepository.GetByUserIdAsync(userId);
            if (company == null) return false;

            return await _companyRepository.DeleteAsync(company.Id);
        }

        public async Task<CompanyDto> UploadLogoAsync(int userId, IFormFile file)
        {
            var company = await _companyRepository.GetByUserIdAsync(userId);
            if (company == null)
            {
                throw new ArgumentException("Company not found");
            }

            // Validate file
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("Invalid file");
            }

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            
            if (!allowedExtensions.Contains(fileExtension))
            {
                throw new ArgumentException("Only JPG, PNG, and GIF files are allowed");
            }

            // Create uploads directory if it doesn't exist
            var uploadsPath = Path.Combine("wwwroot", "uploads", "logos");
            Directory.CreateDirectory(uploadsPath);

            // Generate unique filename
            var fileName = $"{userId}_{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Update company
            company.LogoFileName = file.FileName;
            company.LogoFilePath = $"/uploads/logos/{fileName}";

            var updatedCompany = await _companyRepository.UpdateAsync(company);
            return MapToDto(updatedCompany);
        }

        public async Task<bool> DeleteLogoAsync(int userId)
        {
            var company = await _companyRepository.GetByUserIdAsync(userId);
            if (company == null || string.IsNullOrEmpty(company.LogoFilePath))
            {
                return false;
            }

            // Delete physical file
            var physicalPath = Path.Combine("wwwroot", company.LogoFilePath.TrimStart('/'));
            if (File.Exists(physicalPath))
            {
                File.Delete(physicalPath);
            }

            // Update company
            company.LogoFileName = null;
            company.LogoFilePath = null;

            await _companyRepository.UpdateAsync(company);
            return true;
        }

        private CompanyDto MapToDto(Company company)
        {
            return new CompanyDto
            {
                Id = company.Id,
                UserId = company.UserId,
                Name = company.Name,
                Description = company.Description,
                Industry = company.Industry,
                Location = company.Location,
                Website = company.Website,
                LogoFileName = company.LogoFileName,
                LogoFilePath = company.LogoFilePath,
                EmployeeCount = company.EmployeeCount,
                CreatedAt = company.CreatedAt,
                UpdatedAt = company.UpdatedAt
            };
        }
    }
}
