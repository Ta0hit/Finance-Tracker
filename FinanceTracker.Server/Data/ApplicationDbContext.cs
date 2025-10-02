using Microsoft.EntityFrameworkCore;
using FinanceTracker.Server.Models;

namespace FinanceTracker.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        public DbSet<Transaction> Transactions { get; set; } = null!;

    }
}