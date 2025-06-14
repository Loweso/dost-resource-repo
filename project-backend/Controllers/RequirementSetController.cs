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
    public async Task<IActionResult> PostRequirementSet([FromBody] RequirementSetCreateDto dto)
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
    public async Task<IActionResult> Update(int id, [FromBody] RequirementSetCreateDto dto)
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

        // Remove old requirements first
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
            .Include(rs => rs.Requirements) // if you need related requirements
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

}
