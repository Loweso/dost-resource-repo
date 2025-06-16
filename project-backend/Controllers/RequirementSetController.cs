using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project_backend.Models;
using project_backend.Data;

[ApiController]
[Route("api/[controller]")]
public class RequirementSetController : ControllerBase
{
    private readonly DataContext _context;

    public RequirementSetController(DataContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> PostRequirementSet([FromBody] RequirementSetDto dto)
    {
        if (dto == null ||
            string.IsNullOrWhiteSpace(dto.Title) ||
            dto.Requirements == null ||
            !dto.Requirements.Any())
        {
            return BadRequest("Invalid data.");
        }

        var requirementSet = new RequirementSet
        {
            Title = dto.Title,
            Deadline = dto.Deadline,
            Requirements = dto.Requirements.Select(r => new Requirement { Title = r }).ToList()
        };

        _context.RequirementSets.Add(requirementSet);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRequirementSet), new { id = requirementSet.Id }, requirementSet);
    }

    [HttpGet("getAllSimple")]
    public async Task<IActionResult> GetAllRequirement()
    {
        var requirementSets = await _context.RequirementSets
            .Select(u => new
            {
                u.Id,
                u.Title,
                u.Deadline
            })
            .ToListAsync();

        return Ok(requirementSets);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetRequirementSet(int id)
    {
        var set = await _context.RequirementSets
                                   .Include(r => r.Requirements)
                                   .FirstOrDefaultAsync(r => r.Id == id);
        if (set == null) return NotFound();

        return Ok(set);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] RequirementSetDto dto)
    {
        var set = await _context.RequirementSets
            .Include(r => r.Requirements)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (set == null)
        {
            return NotFound();
        }

        set.Title = dto.Title;
        set.Deadline = dto.Deadline;

        _context.Requirements.RemoveRange(set.Requirements);
        set.Requirements = dto.Requirements
            .Select(r => new Requirement { Title = r })
            .ToList();

        await _context.SaveChangesAsync();

        return Ok(set);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRequirementSet(int id)
    {
        var requirementSet = await _context.RequirementSets.FindAsync(id);
        if (requirementSet == null)
        {
            return NotFound("Requirement set not found.");
        }

        _context.RequirementSets.Remove(requirementSet);
        await _context.SaveChangesAsync();

        return Ok("Requirement set successfully deleted.");
    }

    [HttpGet]
    public async Task<IActionResult> GetRequirementSets([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string searchTerm = "")
    {
        var query = _context.RequirementSets
            .Include(rs => rs.Requirements)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            searchTerm = searchTerm.Trim();

            query = query.Where(rs =>
                rs.Title.Contains(searchTerm) ||
                rs.Requirements.Any(r => r.Title.Contains(searchTerm)));
        }

        var total = await query.CountAsync();

        var requirementSets = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { total, data = requirementSets });
    }

    [HttpPost("assign")]
    public async Task<IActionResult> AssignRequirements([FromBody] AssignRequirementsDto dto)
    {
        if (dto == null ||
            dto.StudentIds == null ||
            !dto.StudentIds.Any())
        {
            return BadRequest("Invalid data.");
        }

        var requirementSet = await _context.RequirementSets.FindAsync(dto.RequirementSetId);
        if (requirementSet == null)
        {
            return NotFound("Requirement set not found.");
        }

        var existingAssignments = await _context.UserRequirementSets
            .Where(ur => ur.RequirementSetId == requirementSet.Id)
            .ToListAsync();

        var existingUserIds = existingAssignments.Select(ur => ur.UserId).ToHashSet();

        var newUserIds = dto.StudentIds.ToHashSet();

        var toAdd = newUserIds.Except(existingUserIds);
        var toRemove = existingAssignments.Where(ur => !newUserIds.Contains(ur.UserId));

        foreach (var studentId in toAdd)
        {
            _context.UserRequirementSets.Add(new UserRequirementSet
            {
                UserId = studentId,
                RequirementSetId = requirementSet.Id
            });
        }
        _context.UserRequirementSets.RemoveRange(toRemove);
        await _context.SaveChangesAsync();

        return Ok("Requirements successfully updated.");
    }

    [HttpGet("assign/{requirementSetId}")]
    public async Task<IActionResult> GetAssignedStudents(int requirementSetId)
    {
        var assignedStudentIds = await _context.UserRequirementSets
            .Where(ur => ur.RequirementSetId == requirementSetId)
            .Select(ur => ur.UserId)
            .ToListAsync();

        return Ok(assignedStudentIds);
    }

    [HttpGet("user/{userId}")]
    // Get REQUIREMENT SETS for a user as well as their SUBMISSIONS to that requirement set
    public async Task<IActionResult> GetRequirementsForUser(int userId)
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

    [HttpGet("{requirementSetId}/students")]
    public async Task<IActionResult> GetStudents(int requirementSetId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "")
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        var studentIds = await _context.UserRequirementSets
            .Where(ur => ur.RequirementSetId == requirementSetId)
            .Select(ur => ur.UserId)
            .ToListAsync();

        if (!studentIds.Any()) 
            return Ok(new { total = 0, page, pageSize, students = new List<object>() });

        var query = _context.Users.Where(u => studentIds.Contains(u.Id));

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

}
