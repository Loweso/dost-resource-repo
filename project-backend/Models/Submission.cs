public class UpdateSubmissionDto
{
    public IFormFile File { get; set; } = null!;
    public int reqId { get; set; }
    public int userId { get; set; }
}
