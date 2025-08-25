using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Day12api.Model
{
    public class Book
    {
        public int Id { get; set; }

        [StringLength(100, ErrorMessage = "Title cannot be longer than 100 characters")]
        public required string Title { get; set; }

        [StringLength(50, ErrorMessage = "Author name cannot be longer than 50 characters")]
        public required string Author { get; set; }
        public DateTime PublishedDate { get; set; }
        public required string Genre { get; set; } 
        [Precision(18, 2)] 
        public decimal Price { get; set; }
    
    }
}
