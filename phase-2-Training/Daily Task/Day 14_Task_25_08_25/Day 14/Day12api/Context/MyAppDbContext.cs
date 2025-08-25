using Day12api.Model;
using Microsoft.EntityFrameworkCore;

namespace Day12api.Context
{
    public class MyAppDbContext : DbContext
    {
        public MyAppDbContext(DbContextOptions<MyAppDbContext> options)
            : base(options)
        {

        }
        public DbSet<Book> Books { get; set; }  

        public DbSet<UserDTO> Users { get; set; }

        public DbSet<Author> Authors { get; set; }  

        public DbSet<NewBook> NewBooks { get; set; }
        public DbSet<Sales> Sales { get; set; }
    }
}
