using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace MiniProject2.Models
{
    public class Audience
    {
        public int Id { get; set; }

        [Required]
        [StringLength(25, MinimumLength = 5, ErrorMessage = "Name must be between 5 and 25 characters.")]
        public string Name { get; set; }

        public string Gender { get; set; }

        [Range(6, 90, ErrorMessage = "Age must be greater than 5.")]
        public int Age { get; set; }

        public DateOnly DateOfBirth { get; set; }
    }
}
