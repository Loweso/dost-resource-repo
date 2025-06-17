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

        // GET /api/users
        // Allows pagination, search and role filter
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "", [FromQuery] string role = "")
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(role))
            {
                role = role.Trim();
                query = query.Where(u => u.Role == role);
            }
            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim().ToLower();
                query = query.Where(u =>
                    u.FirstName.ToLower().Contains(search) ||
                    u.MiddleName.ToLower().Contains(search) ||
                    u.LastName.ToLower().Contains(search) ||
                    u.Email.ToLower().Contains(search));
            }

            var total = await query.CountAsync();

            var users = await query
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
                    u.YearLevel,
                    u.Role,
                    u.Email
                })
                .ToListAsync();

            return Ok(new { total, page, pageSize, users });
        }

        // GET /api/users/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(new
            {
                user.Id,
                user.ProfileImageUrl,
                user.FirstName,
                user.MiddleName,
                user.LastName,
                user.Email,
                user.YearLevel,
                user.University,
                user.Course,
                user.Role
            });
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .OrderBy(u => u.LastName)
                .Select(u => new
                {
                    u.Id,
                    u.ProfileImageUrl,
                    u.FirstName,
                    u.MiddleName,
                    u.LastName,
                    u.YearLevel,
                    u.Role,
                    u.Email
                })
                .ToListAsync();

            return Ok(new { total = users.Count, users });
        }

        [HttpGet("{userId}/requirementsets")]
        public async Task<IActionResult> GetForUser(int userId)
        {
            var sets = await _context.RequirementSets
                .Where(rs => rs.UserAssignments.Any(ua => ua.UserId == userId))
                .Select(rs => new
                {
                    rs.Id,
                    rs.Title,
                    rs.Deadline,
                    Requirements = rs.Requirements.Select(r => new
                    {
                        r.Id,
                        r.Title,
                        Submission = _context.Submissions
                            .Where(s => s.UserId == userId && s.RequirementId == r.Id)
                            .Select(s => new
                            {
                                s.ApprovalStatus,
                                s.FilePath,
                                Comments = _context.SubmissionComments
                                    .Where(c => c.SubmissionId == s.Id)
                                    .Select(c => new
                                      {
                                    c.Id,
                                    c.Content,
                                    User = c.User == null ? null : new { c.User.FirstName, c.User.LastName }
                                    })
                                    .ToList()
                            })
                            .FirstOrDefault()
                    })
                })
                .ToListAsync();

            return Ok(sets);
        }

        // POST /api/users
        // To create a new User
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromForm] IFormFile? profilePicture, [FromForm] string firstName, [FromForm] string lastName, [FromForm] string email, [FromForm] int yearLevel, [FromForm] string password)
        {
            if (string.IsNullOrWhiteSpace(password))
            {
                return BadRequest(new { message = "Password is required." });
            }
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest(new { message = "Email is required." });
            }
            if (await _context.Users.AnyAsync(u => u.Email == email))
            {
                return Conflict(new { message = "Email already in use." });
            }

            string? photoURL = null;
            if (profilePicture != null && profilePicture.Length > 0)
            {
                using (var stream = profilePicture.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams { File = new FileDescription(profilePicture.FileName, stream) };
                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                    photoURL = uploadResult.SecureUrl?.ToString();
                }
            }
            var passwordHash = Convert.ToBase64String(SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(password)));
            var newUser = new User
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                PasswordHash = passwordHash,
                YearLevel = yearLevel,
                ProfileImageUrl = photoURL ?? string.Empty,
                Role = "Student"
            };
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserById), new { id = newUser.Id },
                                   new { message = "User successfully created.", id = newUser.Id });
        }

        // PUT /api/users/{id} 
        // Update whole entity
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromForm] UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            string? photoURL = null;
            if (dto.ProfilePicture != null && dto.ProfilePicture.Length > 0)
            {
                using (var stream = dto.ProfilePicture.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams { File = new FileDescription(dto.ProfilePicture.FileName, stream) };
                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                    photoURL = uploadResult.SecureUrl?.ToString();
                }
            }
            if (photoURL != null)
                user.ProfileImageUrl = photoURL;

            user.FirstName = dto.FirstName;
            user.MiddleName = dto.MiddleName;
            user.LastName = dto.LastName;
            user.Email = dto.Email;
            user.YearLevel = dto.YearLevel;
            user.University = dto.University;
            user.Course = dto.Course;

            await _context.SaveChangesAsync();

            return Ok(new { message = "User updated successfully" });
        }

        // PATCH /api/users/{id}
        // Update role or partial
        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateUserPartially(int id, [FromBody] PatchUserDto dto)
        {
            if (dto.AdminId <= 0 ||
                string.IsNullOrWhiteSpace(dto.Password) ||
                string.IsNullOrWhiteSpace(dto.Role))
            {
                return BadRequest(new { message = "AdminId, password, and role are required." });
            }

            var admin = await _context.Users.FindAsync(dto.AdminId);
            if (admin == null) return Unauthorized(new { message = "Invalid adminId." });

            if (admin.PasswordHash != ComputeHash(dto.Password))
                return Unauthorized(new { message = "Invalid password." });

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.Role = dto.Role;
            await _context.SaveChangesAsync();

            return Ok(new { message = "User role updated successfully." });
        }

        // GET /api/users/{id}/requirements
        [HttpGet("{id}/requirements")]
        public async Task<IActionResult> GetStudentRequirements(int id, [FromQuery] int requirementSetId)
        {
            var student = await _context.Users.FindAsync(id);
            if (student == null) return NotFound("Student not found.");

            var requirements = await _context.Requirements
                .Where(r => r.RequirementSetId == requirementSetId)
                .ToListAsync();

            var submissions = await _context.Submissions
                .Where(s => s.UserId == id && requirements.Select(r => r.Id).Contains(s.RequirementId))
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

        // DELETE /api/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User successfully removed." });
        }

        // DELETE /api/users/me
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
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            HttpContext.Session.Clear();

            return Ok(new { message = "Account successfully removed." });
        }
        
        private string ComputeHash(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}

public class PatchUserDto
{
    public int AdminId { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;

}
