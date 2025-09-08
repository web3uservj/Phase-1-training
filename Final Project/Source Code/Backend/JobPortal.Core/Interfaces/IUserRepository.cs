using JobPortal.Core.Entities;

namespace JobPortal.Core.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> CreateAsync(User user);
        Task<User> UpdateAsync(User user);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(string email);
        Task<IEnumerable<User>> GetByRoleAsync(UserRole role);
        Task<int> GetTotalCountAsync();
    }
}
