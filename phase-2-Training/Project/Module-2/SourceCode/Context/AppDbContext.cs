using Microsoft.EntityFrameworkCore;
using MiniProject2.Models;

namespace MiniProject2.Context
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Audience> audiences { get; set; }

    }
}
