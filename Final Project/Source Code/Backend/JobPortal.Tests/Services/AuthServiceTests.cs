using JobPortal.Core.DTOs;
using JobPortal.Core.Entities;
using JobPortal.Core.Interfaces;
using JobPortal.Core.Services;
using Microsoft.Extensions.Configuration;
using Moq;
using NUnit.Framework;
using System;
using System.Threading.Tasks;

namespace JobPortal.Tests.Services
{
    [TestFixture]
    public class AuthServiceTests
    {
        private Mock<IUserRepository> _mockUserRepository;
        private Mock<IConfiguration> _mockConfiguration;
        private AuthService _authService;

        [SetUp]
        public void Setup()
        {
            _mockUserRepository = new Mock<IUserRepository>();
            _mockConfiguration = new Mock<IConfiguration>();

            // Setup JWT configuration
            var jwtSection = new Mock<IConfigurationSection>();
            jwtSection.Setup(x => x["SecretKey"]).Returns("YourSuperSecretKeyThatIsAtLeast32CharactersLong!");
            jwtSection.Setup(x => x["Issuer"]).Returns("JobPortalAPI");
            jwtSection.Setup(x => x["Audience"]).Returns("JobPortalClient");
            jwtSection.Setup(x => x["ExpirationInMinutes"]).Returns("60");

            _mockConfiguration.Setup(x => x.GetSection("JwtSettings")).Returns(jwtSection.Object);

            _authService = new AuthService(_mockUserRepository.Object, _mockConfiguration.Object);
        }

        [Test]
        public async Task RegisterAsync_WithValidData_ShouldCreateUser()
        {
            var registerDto = new RegisterUserDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                Password = "password123",
                PhoneNumber = "1234567890",
                Role = UserRole.JobSeeker
            };

            _mockUserRepository.Setup(x => x.ExistsAsync(registerDto.Email))
                .ReturnsAsync(false);

            _mockUserRepository.Setup(x => x.CreateAsync(It.IsAny<User>()))
                .ReturnsAsync((User user) =>
                {
                    user.Id = 1;
                    return user;
                });

            var result = await _authService.RegisterAsync(registerDto);

            Assert.NotNull(result);
            Assert.NotNull(result.Token);
            Assert.AreEqual(registerDto.Email, result.User.Email);
            Assert.AreEqual(registerDto.FirstName, result.User.FirstName);
            Assert.AreEqual(registerDto.LastName, result.User.LastName);
            Assert.AreEqual(registerDto.Role, result.User.Role);

            _mockUserRepository.Verify(x => x.ExistsAsync(registerDto.Email), Times.Once);
            _mockUserRepository.Verify(x => x.CreateAsync(It.IsAny<User>()), Times.Once);
        }

        [Test]
        public void RegisterAsync_WithExistingEmail_ShouldThrowException()
        {
            var registerDto = new RegisterUserDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "existing@example.com",
                Password = "password123",
                PhoneNumber = "1234567890",
                Role = UserRole.JobSeeker
            };

            _mockUserRepository.Setup(x => x.ExistsAsync(registerDto.Email))
                .ReturnsAsync(true);

            var ex = Assert.ThrowsAsync<InvalidOperationException>(async () =>
                await _authService.RegisterAsync(registerDto));

            Assert.AreEqual("User with this email already exists", ex.Message);

            _mockUserRepository.Verify(x => x.ExistsAsync(registerDto.Email), Times.Once);
            _mockUserRepository.Verify(x => x.CreateAsync(It.IsAny<User>()), Times.Never);
        }

        [Test]
        public async Task LoginAsync_WithValidCredentials_ShouldReturnAuthResponse()
        {
            var loginDto = new LoginDto
            {
                Email = "john.doe@example.com",
                Password = "password123"
            };

            var user = new User
            {
                Id = 1,
                FirstName = "John",
                LastName = "Doe",
                Email = loginDto.Email,
                PasswordHash = _authService.HashPassword(loginDto.Password),
                Role = UserRole.JobSeeker,
                IsActive = true
            };

            _mockUserRepository.Setup(x => x.GetByEmailAsync(loginDto.Email))
                .ReturnsAsync(user);

            var result = await _authService.LoginAsync(loginDto);

            Assert.NotNull(result);
            Assert.NotNull(result.Token);
            Assert.AreEqual(user.Email, result.User.Email);
            Assert.AreEqual(user.Id, result.User.Id);

            _mockUserRepository.Verify(x => x.GetByEmailAsync(loginDto.Email), Times.Once);
        }

        [Test]
        public void LoginAsync_WithInvalidCredentials_ShouldThrowException()
        {
            var loginDto = new LoginDto
            {
                Email = "john.doe@example.com",
                Password = "wrongpassword"
            };

            var user = new User
            {
                Id = 1,
                Email = loginDto.Email,
                PasswordHash = _authService.HashPassword("correctpassword"),
                IsActive = true
            };

            _mockUserRepository.Setup(x => x.GetByEmailAsync(loginDto.Email))
                .ReturnsAsync(user);

            var ex = Assert.ThrowsAsync<UnauthorizedAccessException>(async () =>
                await _authService.LoginAsync(loginDto));

            Assert.AreEqual("Invalid email or password", ex.Message);
        }

        [Test]
        public void HashPassword_ShouldReturnHashedPassword()
        {
            var password = "testpassword123";
            var hashedPassword = _authService.HashPassword(password);

            Assert.NotNull(hashedPassword);
            Assert.AreNotEqual(password, hashedPassword);
            Assert.IsTrue(_authService.VerifyPassword(password, hashedPassword));
        }

        [Test]
        public void VerifyPassword_WithCorrectPassword_ShouldReturnTrue()
        {
            var password = "testpassword123";
            var hashedPassword = _authService.HashPassword(password);

            var result = _authService.VerifyPassword(password, hashedPassword);

            Assert.IsTrue(result);
        }

        [Test]
        public void VerifyPassword_WithIncorrectPassword_ShouldReturnFalse()
        {
            var password = "testpassword123";
            var wrongPassword = "wrongpassword";
            var hashedPassword = _authService.HashPassword(password);

            var result = _authService.VerifyPassword(wrongPassword, hashedPassword);

            Assert.IsFalse(result);
        }
    }
}
