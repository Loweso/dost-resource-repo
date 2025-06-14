public class RequirementSetCreateDto
{
    public string Title { get; set; } = string.Empty;
    public DateTime Deadline { get; set; }
    public List<string> Requirements { get; set; } = new List<string>();
}
