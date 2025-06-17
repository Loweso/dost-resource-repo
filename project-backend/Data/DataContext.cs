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

        public DbSet<Submission> Submissions => Set<Submission>();

        public DbSet<SubmissionComment> SubmissionComments => Set<SubmissionComment>();

        public DbSet<Article> Articles => Set<Article>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<SubmissionComment>()
                .HasOne(sc => sc.Submission)
                .WithMany()
                .HasForeignKey(sc => sc.SubmissionId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SubmissionComment>()
                .HasOne(sc => sc.User)
                .WithMany()
                .HasForeignKey(sc => sc.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
