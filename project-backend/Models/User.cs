using System.ComponentModel.DataAnnotations;

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
        public string University { get; set; } = string.Empty;

        [MaxLength(150)]
        public string Course { get; set; } = string.Empty;

        [Range(1, 4, ErrorMessage = "Year level must be between 1 and 4.")]
        public int YearLevel { get; set; }
    }
}