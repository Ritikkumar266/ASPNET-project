using System.ComponentModel.DataAnnotations;

namespace GrievanceApi.DTOs.Feedback;

public class CreateFeedbackDto
{
    [Required]
    public string ComplaintId { get; set; } = null!;

    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }

    [StringLength(1000)]
    public string Comment { get; set; } = string.Empty;
}

public class FeedbackResponseDto
{
    public string Id { get; set; } = null!;
    public string ComplaintId { get; set; } = null!;
    public string ComplaintTitle { get; set; } = string.Empty;
    public string CitizenId { get; set; } = null!;
    public string CitizenName { get; set; } = string.Empty;
    public string? DepartmentId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
