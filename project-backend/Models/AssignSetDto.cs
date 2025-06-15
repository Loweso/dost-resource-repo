public class AssignRequirementsDto
{
    public int RequirementSetId { get; set; }
    public List<int> StudentIds { get; set; } = new List<int>();
}