using Microsoft.EntityFrameworkCore;
using project_backend.Models;

namespace project_backend.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        
        public DbSet<User> Users => Set<User>();

        public DbSet<RequirementSet> RequirementSets => Set<RequirementSet>();

        public DbSet<Requirement> Requirements => Set<Requirement>();

        public DbSet<UserRequirementSet> UserRequirementSets => Set<UserRequirementSet>();
    }
}
