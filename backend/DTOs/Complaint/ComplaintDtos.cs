using System.ComponentModel.DataAnnotations;

namespace GrievanceApi.DTOs.Complaint;

public class CreateComplaintDto
{
    [Required]
    [StringLength(200, MinimumLength = 5)]
    public string Title { get; set; } = null!;

    [Required]
    [StringLength(2000, MinimumLength = 10)]
    public string Description { get; set; } = null!;

    [Required]
    public string Category { get; set; } = null!;

    [Required]
    public string Priority { get; set; } = "Medium";

    [StringLength(500)]
    public string Address { get; set; } = string.Empty;

    public string? DepartmentId { get; set; }
}

public class AssignComplaintDto
{
    [Required]
    public string DepartmentId { get; set; } = null!;
}

public class UpdateStatusDto
{
    [Required]
    public string Status { get; set; } = null!;

    [StringLength(1000)]
    public string Remarks { get; set; } = string.Empty;
}

public class ComplaintResponseDto
{
    public string Id { get; set; } = null!;
    public string TrackingId { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Category { get; set; } = null!;
    public string Priority { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string Address { get; set; } = string.Empty;
    public string CitizenId { get; set; } = null!;
    public string CitizenName { get; set; } = string.Empty;
    public string? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public List<StatusHistoryDto> StatusHistory { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool HasFeedback { get; set; }
}

public class StatusHistoryDto
{
    public string Status { get; set; } = null!;
    public string Remarks { get; set; } = string.Empty;
    public string ChangedBy { get; set; } = null!;
    public string ChangedByName { get; set; } = string.Empty;
    public DateTime ChangedAt { get; set; }
}
