using JobPortal.Core.DTOs;

namespace JobPortal.Core.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterUserDto registerDto);
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        string GenerateJwtToken(UserDto user);
        string HashPassword(string password);
        bool VerifyPassword(string password, string hashedPassword);
    }
}
