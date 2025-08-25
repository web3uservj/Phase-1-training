using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Day12api.Model
{
    public class NewBook
    {
        [Key]
        public int NewBookId { get; set; }

       

        [StringLength(50 ,MinimumLength =5)]
        public required string Title { get; set; }

        public decimal price { get; set; }

        public int AuthorId { get; set; }

        [ForeignKey("AuthorId")]
        public Author author { get; set; }
    }
}
