using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using project_backend.Data;
using System.Net;

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly Cloudinary _cloudinary;
    private readonly DataContext _context;

    public ArticlesController(Cloudinary cloudinary, DataContext context)
    {
        _cloudinary = cloudinary;
        _context = context;
    }
    
    // GET (with pagination & search)
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string searchTerm = "")
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        var query = _context.Articles.AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            searchTerm = searchTerm.Trim();

            query = query.Where(a => a.Title.Contains(searchTerm) ||
                                      a.Content.Contains(searchTerm)); 
        }
        
        var total = await query.CountAsync();

        var articles = await query
            .OrderBy(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { total, page, pageSize, articles });
    }

    // GET/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var article = await _context.Articles.FindAsync(id);
        if (article == null) return NotFound();

        return Ok(article);
    }

    // GET /api/articles/latest
    [HttpGet("latest")]
    public async Task<IActionResult> GetLatest()
    {
        var articles = await _context.Articles
            .OrderByDescending(a => a.CreatedAt)
            .Take(5)
            .ToListAsync();

        return Ok(articles);
    }

    // POST
    [HttpPost]
    public async Task<IActionResult> Post([FromForm] ArticleUploadDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title) ||
            string.IsNullOrWhiteSpace(dto.Content))
        {
            return BadRequest("Title and Content are required.");
        }
    
        string? imageUrl = null;

        if (dto.Image != null && dto.Image.Length > 0)
        {
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(dto.Image.FileName, dto.Image.OpenReadStream()),
                Transformation = new Transformation().Width(500).Height(500).Crop("limit"),
            };
            
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            if (uploadResult.StatusCode == HttpStatusCode.OK)
            {
                imageUrl = uploadResult.SecureUrl?.ToString();
            }
            else
            {
                return BadRequest("Image upload failed.");
            }
        }
    
        var article = new Article
        {
            Title = dto.Title,
            Content = dto.Content,
            PictureUrl = imageUrl ?? string.Empty,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    
        _context.Articles.Add(article);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = article.Id }, article);
    }

    // PUT/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromForm] ArticleUploadDto dto)
    {
        var article = await _context.Articles.FindAsync(id);
        if (article == null)
        {
            return NotFound("Article not found.");
        }
        if (string.IsNullOrWhiteSpace(dto.Title) ||
            string.IsNullOrWhiteSpace(dto.Content))
        {
            return BadRequest("Title and Content are required.");
        }
        article.Title = dto.Title;
        article.Content = dto.Content;
        article.UpdatedAt = DateTime.UtcNow;

        if (dto.Image != null && dto.Image.Length > 0)
        {
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(dto.Image.FileName, dto.Image.OpenReadStream()),
                Transformation = new Transformation().Width(500).Height(500).Crop("limit"),
            };
            
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            if (uploadResult.StatusCode == HttpStatusCode.OK)
            {
                article.PictureUrl = uploadResult.SecureUrl?.ToString() ?? string.Empty;
            }
            else
            {
                return BadRequest("Image upload failed.");
            }
        }
        await _context.SaveChangesAsync();

        return Ok(article);
    }    

    // DELETE/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var article = await _context.Articles.FindAsync(id);
        if (article == null) return NotFound();

        _context.Articles.Remove(article);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
