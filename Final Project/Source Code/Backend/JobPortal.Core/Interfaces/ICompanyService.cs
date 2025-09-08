using JobPortal.Core.DTOs;
using Microsoft.AspNetCore.Http;

namespace JobPortal.Core.Interfaces
{
    public interface ICompanyService
    {
        Task<CompanyDto?> GetCompanyByUserIdAsync(int userId);
        Task<CompanyDto?> GetCompanyByIdAsync(int id);
        Task<IEnumerable<CompanyDto>> GetAllCompaniesAsync();
        Task<CompanyDto> CreateCompanyAsync(int userId, CreateCompanyDto createDto);
        Task<CompanyDto> UpdateCompanyAsync(int userId, UpdateCompanyDto updateDto);
        Task<bool> DeleteCompanyAsync(int userId);
        Task<CompanyDto> UploadLogoAsync(int userId, IFormFile file);
        Task<bool> DeleteLogoAsync(int userId);
    }
}
