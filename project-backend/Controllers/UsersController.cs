using Microsoft.AspNetCore.Mvc;
using project_backend.Models;
using project_backend.Data;
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
        private readonly DataContext _context;

        public UsersController(DataContext context)
        {
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
                isVerified = user.IsVerified
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.FirstName = dto.FirstName;
            user.MiddleName = dto.MiddleName;
            user.LastName = dto.LastName;
            user.Email = dto.Email;
            user.YearLevel = dto.YearLevel;
            user.University = dto.University;
            user.Course = dto.Course;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return NoContent();
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
                .Select(u => new { u.Id, u.FirstName, u.LastName, u.YearLevel, u.ProfileImageUrl, u.IsVerified })
                .ToListAsync();

            return Ok(users);
        }


    }
}