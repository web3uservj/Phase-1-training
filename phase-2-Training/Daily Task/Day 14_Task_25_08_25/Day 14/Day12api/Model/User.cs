using System.ComponentModel.DataAnnotations;

namespace Day12api.Model
{
    public class UserDTO
    {
        public int Id { get; set; }

        [StringLength(50, ErrorMessage = "Username cannot be longer than 50 characters")]
        public required string Username { get; set; }

        [StringLength(100, ErrorMessage = "Email cannot be longer than 100 characters")]
        public required string Email { get; set; }

        [StringLength(64)]
        public required string Password { get; set; }
     
    }
}
