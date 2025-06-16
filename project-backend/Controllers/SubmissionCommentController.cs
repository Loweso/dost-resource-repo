using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project_backend.Data;
using project_backend.Models;

[ApiController]
[Route("api/[controller]")]
public class SubmissionCommentController : ControllerBase
{
    private readonly DataContext _context;

    public SubmissionCommentController(DataContext context)
    {
        _context = context;
    }
    
    [HttpGet("{submissionId}")]
    public async Task<IActionResult> GetComments(int submissionId)
    {
        var comments = await _context.SubmissionComments
            .Where(s => s.SubmissionId == submissionId)
            .Select(s => new 
            {
                s.Id,
                s.Content,
                s.CreatedAt,
                User = new 
                {
                    s.UserId,
                    s.User!.ProfileImageUrl,
                    s.User!.FirstName,
                    s.User!.MiddleName,
                    s.User!.LastName
                }
            })
            .ToListAsync();

        return Ok(comments);
    }
    
    [HttpPost]
    public async Task<IActionResult> PostComment([FromBody] SubmissionComment comment)
    {
        _context.SubmissionComments.Add(comment);
        await _context.SaveChangesAsync();

        return Ok(comment);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateComment(int id, [FromBody] SubmissionComment updatedComment)
    {
        var comment = await _context.SubmissionComments.FindAsync(id);
        if (comment == null) return NotFound();

        comment.Content = updatedComment.Content;
        await _context.SaveChangesAsync();

        return Ok(comment);
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteComment(int id)
    {
        var comment = await _context.SubmissionComments.FindAsync(id);
        if (comment == null) return NotFound();

        _context.SubmissionComments.Remove(comment);
        await _context.SaveChangesAsync();

        return Ok();
    }
}
