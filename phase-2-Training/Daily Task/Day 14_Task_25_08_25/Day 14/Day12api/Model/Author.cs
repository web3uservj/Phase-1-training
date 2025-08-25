using System.ComponentModel.DataAnnotations;

namespace Day12api.Model
{
    public class Author
    {
        public int AuthorId { get; set; }

        [StringLength(50, MinimumLength = 5)]
        public string AuthorName { get; set; }  
    }
}
