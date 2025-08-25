using System.ComponentModel.DataAnnotations.Schema;

namespace Day12api.Model
{
    public class Sales
    {
        public int SalesId { get; set; }    
        public int BookId { get; set; }
        public int num_of_copies { get; set; }
        public int?  Year { get; set; }
        [ForeignKey("BookId")]
        public NewBook? Bokk { get; set; }
    }
}
