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
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly DataContext _context;

        public AuthController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserSignupDto request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest("User already exists");

            var passwordHash = ComputeHash(request.Password);

            var user = new User
            {
                Email = request.Email,
                PasswordHash = passwordHash,
                Role = "Student"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("User registered");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return Unauthorized("User not found");

            if (user.PasswordHash != ComputeHash(request.Password))
                return Unauthorized("Incorrect password");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            // Sign in user
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            // ✅ Store session values
            HttpContext.Session.SetString("userId", user.Id.ToString());
            HttpContext.Session.SetString("email", user.Email);
            HttpContext.Session.SetString("role", user.Role);

            return Ok(new { userId = user.Id, role = user.Role });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            HttpContext.Session.Clear();
            return Ok(new { message = "Logout successful" });
        }

        [HttpGet("session")]
        public IActionResult GetSession()
        {
            if (HttpContext.Session.TryGetValue("userId", out var userIdBytes))
            {
                string userId = Encoding.UTF8.GetString(userIdBytes);
                string? email = HttpContext.Session.GetString("email");
                string? role = HttpContext.Session.GetString("role");

                return Ok(new
                {
                    user = new
                    {
                        id = userId,
                        email = email,
                        role = role
                    }
                });
            }

            return Unauthorized(new { message = "No active session" });
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
