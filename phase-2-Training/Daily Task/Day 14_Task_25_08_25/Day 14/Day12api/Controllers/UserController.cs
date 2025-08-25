using Day12api.Context;
using Day12api.Model;   
using Day12api.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using WebApi.Security;

namespace Day12api.Controllers
{
    public class UserController : Controller
    {
        MyAppDbContext appDbContext;
        Microsoft.Extensions.Options.IOptions<JWTOption> options;

        public UserController(MyAppDbContext ctxt, Microsoft.Extensions.Options.IOptions<JWTOption> _jwtOption)
        {
            appDbContext = ctxt;
            options = _jwtOption;
        }

        [HttpPost("Login")]
        public IActionResult Login(Model.LoginRequest loginreq)
        {
            var name = loginreq.Username;   
            var hashedPassword = GetHashPassword(loginreq.Password);

            var is_user_available = appDbContext.Users
                .Where(x => x.Username == name && x.Password == hashedPassword)
                .Count();

            if (is_user_available == 0)
            {
                return Unauthorized("Invalid username or password");
            }
            else
            {
                var claims = new List<Claim>
                {
                    new(ClaimTypes.Name, name),
                    new Claim("Password", hashedPassword)
                };

                var token = JwtService.createJwtToken(options.Value, claims);
                return Ok(new { Token = token });
            }
        }
     
        [HttpPost("AddUser")]
        public IActionResult AddUser(UserDTO user)
        {
            user.Password = GetHashPassword(user.Password);
            appDbContext.Users.Add(user);
            appDbContext.SaveChanges();
            return Ok("User added successfully");
        }
        [Authorize]
        [HttpGet("GetAllUsers")]
        public IActionResult GetAllUsers()
        {
            var users = appDbContext.Users.ToList();
            return Ok(users);
        }

        [HttpGet("GetAllUsers_v2")]
        public IActionResult GetAllUsers_v2()
        {
            var users = appDbContext.Users
                .Select(x => new { x.Username, x.Email })
                .ToList();

            return Ok(users);
        }

        private string GetHashPassword(string password)
        {
            using (SHA256 sha = SHA256.Create())
            {
                byte[] passBytes = Encoding.UTF8.GetBytes(password);
                byte[] hashBytes = sha.ComputeHash(passBytes);
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    builder.Append(hashBytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}
