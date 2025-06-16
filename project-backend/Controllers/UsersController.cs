using Microsoft.AspNetCore.Mvc;
using project_backend.Models;
using CloudinaryDotNet;
using project_backend.Data;
using CloudinaryDotNet.Actions;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace project_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {   
        private readonly Cloudinary _cloudinary;
        private readonly DataContext _context;

        public UsersController(Cloudinary cloudinary, DataContext context)
        {
            _cloudinary = cloudinary;

            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(new
            {
                profileImageUrl = user.ProfileImageUrl,
                firstName = user.FirstName,
                middleName = user.MiddleName,
                lastName = user.LastName,
                email = user.Email,
                yearLevel = user.YearLevel,
                university = user.University,
                course = user.Course,
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromForm] IFormFile? profilePicture, [FromForm] string firstName, [FromForm] string lastName, [FromForm] string email, [FromForm] int yearLevel)
        {
            string? photoURL = null;
            if (profilePicture != null && profilePicture.Length > 0)
            {
                using (var stream = profilePicture.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(profilePicture.FileName, stream)
                    };
                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                    photoURL = uploadResult.SecureUrl?.ToString();
                }
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            if (photoURL != null) user.ProfileImageUrl = photoURL;
            user.FirstName = firstName;
            user.LastName = lastName;
            user.Email = email;
            user.YearLevel = yearLevel;

            await _context.SaveChangesAsync();

            return Ok("User updated.");
        }

        [HttpDelete("me")]
        public async Task<IActionResult> DeleteCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var userId = int.Parse(userIdClaim);
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            HttpContext.Session.Clear();

            return Ok(new { message = "Account deleted successfully" });
        }

        [HttpGet("simple")]
        public async Task<IActionResult> GetAllUsersSimple()
        {
            var users = await _context.Users
                .Where(u => u.Role == "Student")
                .Select(u => new { u.Id, u.FirstName, u.LastName, u.YearLevel, u.ProfileImageUrl })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("getAll")]
        public async Task<IActionResult> GetAllStudents([FromQuery] int requirementSetId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "")
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            var studentIds = await _context.UserRequirementSets
                .Where(ur => ur.RequirementSetId == requirementSetId)
                .Select(ur => ur.UserId)
                .ToListAsync();

            if (!studentIds.Any())
            {
                return Ok(new { total = 0, page, pageSize, students = new List<object>() });
            }

            var query = _context.Users
                .Where(u => studentIds.Contains(u.Id));

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim().ToLower();
                query = query.Where(u =>
                    u.FirstName.ToLower().Contains(search) ||
                    u.MiddleName.ToLower().Contains(search) ||
                    u.LastName.ToLower().Contains(search));
            }

            var total = await query.CountAsync();

            var studentRecords = await query
                .OrderBy(u => u.LastName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new
                {
                    u.Id,
                    u.ProfileImageUrl,
                    u.FirstName,
                    u.MiddleName,
                    u.LastName,
                    u.YearLevel
                })
                .ToListAsync();

            return Ok(new { total, page, pageSize, students = studentRecords });
        }

        [HttpGet("{studentId}/requirements")]
        public async Task<IActionResult> GetStudentRequirements(int studentId, [FromQuery] int requirementSetId)
        {
            var student = await _context.Users.FindAsync(studentId);
            if (student == null)
            {
                return NotFound("Student not found.");
            }

            var requirements = await _context.Requirements
                .Where(r => r.RequirementSetId == requirementSetId)
                .ToListAsync();

            var submissions = await _context.Submissions
                .Where(s => s.UserId == studentId && requirements.Select(r => r.Id).Contains(s.RequirementId))
                .ToListAsync();

            var result = requirements.Select(r => new
            {
                r.Id,
                r.Title,
                submission = submissions
                    .Where(s => s.RequirementId == r.Id)
                    .Select(s => new { s.Id, s.FilePath, s.ApprovalStatus })
                    .FirstOrDefault()
            });

            return Ok(result);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers([FromQuery] string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return BadRequest(new { message = "Search term is required." });
            }
            searchTerm = searchTerm.Trim().ToLower();

            var matchingUsers = await _context.Users
                .Where(u =>
                    u.FirstName.ToLower().Contains(searchTerm) ||
                    u.MiddleName.ToLower().Contains(searchTerm) ||
                    u.LastName.ToLower().Contains(searchTerm))
                .Select(u => new
                {
                    u.Id,
                    u.ProfileImageUrl,
                    u.FirstName,
                    u.MiddleName,
                    u.LastName,
                    u.YearLevel,
                    u.Role
                })
                .ToListAsync();

            return Ok(matchingUsers);
        }
        
        [HttpPatch("{id}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateRoleDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Role))
            {
                return BadRequest(new { message = "Role is required." });
            }
            if (string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest(new { message = "Password is required." });
            }
            
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }
            
            var passwordHash = Convert.ToBase64String(SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(dto.Password)));
            if (user.PasswordHash != passwordHash)
            {
                return Unauthorized(new { message = "Invalid password." });
            }
            
            user.Role = dto.Role;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User role updated successfully." });
        }

        public class UpdateRoleDto
        {
            public string Role { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

    }
}