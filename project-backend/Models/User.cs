using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public enum ApprovalStatus
{
    Missing,
    Pending,
    Approved,
    Rejected
}

namespace project_backend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string MiddleName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [MaxLength(256)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(200)]
        public string University { get; set; } = "University of the Philippines Cebu";

        [MaxLength(150)]
        public string Course { get; set; } = string.Empty;

        [Range(1, 8, ErrorMessage = "Year level must be between 1 and 8.")]
        public int YearLevel { get; set; }

        [Required]
        [MaxLength(12)]
        public string Role { get; set; } = "Student";

        public string ProfileImageUrl { get; set; } = string.Empty;

    }

    public class RequirementSet
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;
        public DateTime Deadline { get; set; }
        public ICollection<Requirement> Requirements { get; set; } = new List<Requirement>();

        public ICollection<UserRequirementSet> UserAssignments { get; set; } = new List<UserRequirementSet>();
    }

    public class UserRequirementSet
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int RequirementSetId { get; set; }
        public RequirementSet? RequirementSet { get; set; }
    }

    public class Requirement
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;
        public int RequirementSetId { get; set; }

        [JsonIgnore]
        public RequirementSet? RequirementSet { get; set; }
    }

    public class Submission
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int RequirementId { get; set; }
        public Requirement? Requirement { get; set; }
        public string FilePath { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Missing;
    }

    public class SubmissionComment
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int SubmissionId { get; set; }
        
        [JsonIgnore]
        public Submission? Submission { get; set; }
        
        [Required]
        public int UserId { get; set; }
        public User? User { get; set; }
        
        [Required]
        [MaxLength(500)]
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}