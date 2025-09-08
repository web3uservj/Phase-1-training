using JobPortal.Core.DTOs;
using JobPortal.Core.Entities;
using JobPortal.Core.Interfaces;
using JobPortal.Core.Services;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortal.Tests.Services
{
    [TestFixture]
    public class UserServiceTests
    {
        private Mock<IUserRepository> _mockUserRepository;
        private UserService _userService;

        [SetUp]
        public void Setup()
        {
            _mockUserRepository = new Mock<IUserRepository>();
            _userService = new UserService(_mockUserRepository.Object);
        }

        [Test]
        public async Task GetUserByIdAsync_WithValidId_ShouldReturnUser()
        {
            var userId = 1;
            var user = new User
            {
                Id = userId,
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                PhoneNumber = "1234567890",
                Role = UserRole.JobSeeker,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _mockUserRepository.Setup(x => x.GetByIdAsync(userId))
                .ReturnsAsync(user);

            var result = await _userService.GetUserByIdAsync(userId);

            Assert.NotNull(result);
            Assert.AreEqual(user.Id, result.Id);
            Assert.AreEqual(user.FirstName, result.FirstName);
            Assert.AreEqual(user.LastName, result.LastName);
            Assert.AreEqual(user.Email, result.Email);
            Assert.AreEqual(user.Role, result.Role);

            _mockUserRepository.Verify(x => x.GetByIdAsync(userId), Times.Once);
        }

        [Test]
        public async Task GetUserByIdAsync_WithInvalidId_ShouldReturnNull()
        {
            var userId = 999;
            _mockUserRepository.Setup(x => x.GetByIdAsync(userId))
                .ReturnsAsync((User?)null);

            var result = await _userService.GetUserByIdAsync(userId);

            Assert.Null(result);
            _mockUserRepository.Verify(x => x.GetByIdAsync(userId), Times.Once);
        }

        [Test]
        public async Task UpdateUserAsync_WithValidData_ShouldUpdateUser()
        {
            var userId = 1;
            var updateDto = new UpdateUserDto
            {
                FirstName = "Jane",
                LastName = "Smith",
                PhoneNumber = "9876543210"
            };

            var existingUser = new User
            {
                Id = userId,
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                PhoneNumber = "1234567890",
                Role = UserRole.JobSeeker,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var updatedUser = new User
            {
                Id = userId,
                FirstName = updateDto.FirstName!,
                LastName = updateDto.LastName!,
                Email = existingUser.Email,
                PhoneNumber = updateDto.PhoneNumber!,
                Role = existingUser.Role,
                IsActive = existingUser.IsActive,
                CreatedAt = existingUser.CreatedAt,
                UpdatedAt = DateTime.UtcNow
            };

            _mockUserRepository.Setup(x => x.GetByIdAsync(userId))
                .ReturnsAsync(existingUser);

            _mockUserRepository.Setup(x => x.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(updatedUser);

            var result = await _userService.UpdateUserAsync(userId, updateDto);

            Assert.NotNull(result);
            Assert.AreEqual(updateDto.FirstName, result.FirstName);
            Assert.AreEqual(updateDto.LastName, result.LastName);
            Assert.AreEqual(updateDto.PhoneNumber, result.PhoneNumber);
            Assert.AreEqual(existingUser.Email, result.Email);

            _mockUserRepository.Verify(x => x.GetByIdAsync(userId), Times.Once);
            _mockUserRepository.Verify(x => x.UpdateAsync(It.IsAny<User>()), Times.Once);
        }

        [Test]
        public void UpdateUserAsync_WithNonExistentUser_ShouldThrowException()
        {
            var userId = 999;
            var updateDto = new UpdateUserDto
            {
                FirstName = "Jane"
            };

            _mockUserRepository.Setup(x => x.GetByIdAsync(userId))
                .ReturnsAsync((User?)null);

            var ex = Assert.ThrowsAsync<ArgumentException>(async () =>
                await _userService.UpdateUserAsync(userId, updateDto));

            Assert.AreEqual("User not found", ex.Message);

            _mockUserRepository.Verify(x => x.GetByIdAsync(userId), Times.Once);
            _mockUserRepository.Verify(x => x.UpdateAsync(It.IsAny<User>()), Times.Never);
        }

        [Test]
        public async Task GetUsersByRoleAsync_WithValidRole_ShouldReturnUsersWithRole()
        {
            var role = UserRole.JobSeeker;
            var users = new List<User>
            {
                new User
                {
                    Id = 1,
                    FirstName = "John",
                    LastName = "Doe",
                    Email = "john@example.com",
                    Role = UserRole.JobSeeker
                },
                new User
                {
                    Id = 2,
                    FirstName = "Jane",
                    LastName = "Smith",
                    Email = "jane@example.com",
                    Role = UserRole.JobSeeker
                }
            };

            _mockUserRepository.Setup(x => x.GetByRoleAsync(role))
                .ReturnsAsync(users);

            var result = await _userService.GetUsersByRoleAsync(role);

            Assert.NotNull(result);
            Assert.AreEqual(2, result.Count());
            Assert.IsTrue(result.All(user => user.Role == role));

            _mockUserRepository.Verify(x => x.GetByRoleAsync(role), Times.Once);
        }

        [Test]
        public async Task DeleteUserAsync_WithValidId_ShouldReturnTrue()
        {
            var userId = 1;
            _mockUserRepository.Setup(x => x.DeleteAsync(userId))
                .ReturnsAsync(true);

            var result = await _userService.DeleteUserAsync(userId);

            Assert.IsTrue(result);
            _mockUserRepository.Verify(x => x.DeleteAsync(userId), Times.Once);
        }

        [Test]
        public async Task DeleteUserAsync_WithInvalidId_ShouldReturnFalse()
        {
            var userId = 999;
            _mockUserRepository.Setup(x => x.DeleteAsync(userId))
                .ReturnsAsync(false);

            var result = await _userService.DeleteUserAsync(userId);

            Assert.IsFalse(result);
            _mockUserRepository.Verify(x => x.DeleteAsync(userId), Times.Once);
        }
    }
}
