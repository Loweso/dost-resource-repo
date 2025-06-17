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

    // GET: /api/requirementset
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string searchTerm = "")
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

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

        return Ok(new { total, page, pageSize, requirementSets });
    }
  
    // GET: /api/requirementsets/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var set = await _context.RequirementSets
                                   .Include(r => r.Requirements)
                                   .FirstOrDefaultAsync(r => r.Id == id);
        if (set == null) return NotFound();

        return Ok(set);
    }

    // GET: /api/requirementsets/allSimple
    [HttpGet("allSimple")]
    public async Task<IActionResult> GetAllUnpaginated()
    {
        var requirementSets = await _context.RequirementSets
            .Select(rs => new { rs.Id, rs.Title, rs.Deadline })
            .ToListAsync();

        return Ok(requirementSets);
    }
  
    // POST: /api/requirementsets
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] RequirementSetDto dto)
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

        return CreatedAtAction(nameof(Get), new { id = requirementSet.Id }, requirementSet);
    }
  
    // PUT: /api/requirementsets/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] RequirementSetDto dto)
    {
        var set = await _context.RequirementSets
                                   .Include(r => r.Requirements)
                                   .FirstOrDefaultAsync(r => r.Id == id);
        if (set == null) return NotFound();

        set.Title = dto.Title;
        set.Deadline = dto.Deadline;

        _context.Requirements.RemoveRange(set.Requirements);
        set.Requirements = dto.Requirements.Select(r => new Requirement { Title = r }).ToList();

        await _context.SaveChangesAsync();

        return Ok(set);
    }
  
    // DELETE: /api/requirementsets/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var requirementSet = await _context.RequirementSets.FindAsync(id);
        if (requirementSet == null) return NotFound();

        _context.RequirementSets.Remove(requirementSet);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("{id}/students")]
    public async Task<IActionResult> GetAssignedStudents(int id, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "")
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        var studentIds = await _context.UserRequirementSets
            .Where(ur => ur.RequirementSetId == id)
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
  
    // GET: /api/requirementsets/{id}/students
    [HttpGet("{id}/studentIds")]
    public async Task<IActionResult> GetAssignedStudents(int id, [FromQuery] string search = "")
    {

        var studentIds = await _context.UserRequirementSets
            .Where(ur => ur.RequirementSetId == id)
            .Select(ur => ur.UserId)
            .ToListAsync();

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

        return Ok(new { total, studentIds });
    }
  
    // PUT: /api/requirementsets/{id}/assign-students
    [HttpPut("{id}/assign-students")]
    public async Task<IActionResult> AssignStudents(int id, [FromBody] AssignRequirementsDto dto)
    {
        if (dto == null ||
            dto.StudentIds == null ||
            !dto.StudentIds.Any()) 
        { 
            return BadRequest("Invalid data.");
        }
  
        var requirementSet = await _context.RequirementSets.FindAsync(id);
        if (requirementSet == null) return NotFound();

        var existingAssignments = await _context.UserRequirementSets
            .Where(ur => ur.RequirementSetId == id)
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
                RequirementSetId = id
            });
        }
        _context.UserRequirementSets.RemoveRange(toRemove);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}