using System.Net;
using CloudinaryDotNet;
using project_backend.Data;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project_backend.Models;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class SubmissionController : ControllerBase
{
    private readonly Cloudinary _cloudinary;
    private readonly DataContext _context;
    private readonly ILogger<SubmissionController> _logger;

    public SubmissionController(Cloudinary cloudinary, DataContext context, ILogger<SubmissionController> logger)
    {
        _cloudinary = cloudinary;
        _context = context;
        _logger = logger;
    }

    [HttpPost("update")]
    public async Task<IActionResult> UpdateSubmission([FromForm] IFormFile file, [FromForm] int setId, [FromForm] int reqId, [FromForm] int userId)
    {
        if (file == null)
            return BadRequest("File is required.");

        var allowed = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
        var ext = Path.GetExtension(file.FileName).ToLower();

        if (!allowed.Contains(ext))
            return BadRequest("Invalid file format.");

        var uploadParams = new RawUploadParams()
        {
            File = new FileDescription(file.FileName, file.OpenReadStream()),
            PublicId = Guid.NewGuid().ToString()
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        if (uploadResult?.StatusCode != HttpStatusCode.OK)
        {
            return BadRequest("Cloud upload failed.");
        }
        var fileURL = uploadResult.SecureUrl?.ToString();

        if (string.IsNullOrEmpty(fileURL))
            return BadRequest("Failed to retrieve Cloudinary URL.");

        var submission = await _context.Submissions
            .FirstOrDefaultAsync(s => s.RequirementId == reqId && s.UserId == userId);

        if (submission == null)
        {
            submission = new Submission
            {
                UserId = userId,
                RequirementId = reqId,
                FilePath = fileURL,
                ApprovalStatus = ApprovalStatus.Pending,
                SubmittedAt = DateTime.UtcNow
            };
            _context.Submissions.Add(submission);
        }
        else
        {
            submission.FilePath = fileURL;
            submission.ApprovalStatus = ApprovalStatus.Pending;
            submission.SubmittedAt = DateTime.UtcNow;
        }
        await _context.SaveChangesAsync();

        return Ok(new { message = "Submission updated successfully.", url = fileURL });
    }

    [HttpDelete("delete/{reqId}")]
    public async Task<IActionResult> DeleteSubmission(int reqId)
    {
        var submission = await _context.Submissions
            .FirstOrDefaultAsync(s => s.RequirementId == reqId);

        if (submission == null)
            return NotFound();

        _context.Submissions.Remove(submission);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Submission removed successfully." });
    }

}
