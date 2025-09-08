using JobPortal.Core.DTOs;
using JobPortal.Core.Entities;

namespace JobPortal.Core.Interfaces
{
    public interface IUserService
    {
        Task<UserDto?> GetUserByIdAsync(int id);
        Task<UserDto?> GetUserByEmailAsync(string email);
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto> UpdateUserAsync(int id, UpdateUserDto updateDto);
        Task<bool> DeleteUserAsync(int id);
        Task<IEnumerable<UserDto>> GetUsersByRoleAsync(UserRole role);
        Task<int> GetTotalUsersCountAsync();
    }
}
