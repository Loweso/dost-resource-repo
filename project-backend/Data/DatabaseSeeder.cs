using Bogus;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

using project_backend.Models;

namespace project_backend.Data.Seed
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(DataContext context)
        {
            if (await context.Users.AnyAsync()) return;

            var hasher = new PasswordHasher<User>();
            var random = new Random();
            var faker = new Faker();

            var users = new List<User>();
            for (int i = 0; i < 10; i++)
            {
                var user = new User
                {
                    FirstName = faker.Name.FirstName(),
                    MiddleName = faker.Name.FirstName(),
                    LastName = faker.Name.LastName(),
                    Email = faker.Internet.Email(),
                    Course = faker.PickRandom(new[] {
                        "BS Computer Science",
                        "BS Biology",
                        "BS Statistics",
                        "BS Mathematics",
                    }),
                    YearLevel = faker.Random.Int(1, 4),
                    Role = "Student",
                    ProfileImageUrl = ""
                };

                var plainPassword = faker.Internet.Password();
                user.PasswordHash = hasher.HashPassword(user, plainPassword);

                users.Add(user);
            }

            var admin = new User
            {
                FirstName = "System",
                MiddleName = "A.",
                LastName = "Admin",
                Email = "admin@up.edu.ph",
                Course = "N/A",
                YearLevel = 0,
                Role = "Admin",
                ProfileImageUrl = ""
            };

            admin.PasswordHash = hasher.HashPassword(admin, "admin123");
            context.Users.Add(admin);
            users.Add(admin);
            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();

            var requirementSets = new List<RequirementSet>();

            for (int i = 0; i < 2; i++)
            {
                var reqSet = new RequirementSet
                {
                    Title = $"SY 2024-2025 Semester {i + 1} Requirements",
                    Deadline = DateTime.UtcNow.AddDays(14),
                    Requirements = new List<Requirement>()
                };

                reqSet.Requirements.Add(new Requirement
                {
                    Title = "Study Load",
                    RequirementSetId = reqSet.Id,
                });
                reqSet.Requirements.Add(new Requirement
                {
                    Title = "True Copy of Grades",
                    RequirementSetId = reqSet.Id,
                });

                requirementSets.Add(reqSet);
            }

            await context.RequirementSets.AddRangeAsync(requirementSets);
            await context.SaveChangesAsync();

            var userReqSets = users.SelectMany(user =>
                requirementSets.Select(rs => new UserRequirementSet
                {
                    UserId = user.Id,
                    RequirementSetId = rs.Id
                })
            ).ToList();

            await context.UserRequirementSets.AddRangeAsync(userReqSets);
            await context.SaveChangesAsync();

            var articleFaker = new Faker<Article>()
                .RuleFor(a => a.Title, f => f.Lorem.Sentence())
                .RuleFor(a => a.Content, f => f.Lorem.Paragraphs(3))
                .RuleFor(a => a.PictureUrl, f => "") // Empty image
                .RuleFor(a => a.CreatedAt, f => f.Date.Past())
                .RuleFor(a => a.UpdatedAt, f => f.Date.Recent());

            var articles = articleFaker.Generate(5);
            await context.AddRangeAsync(articles);
            await context.SaveChangesAsync();
        }
    }
}
