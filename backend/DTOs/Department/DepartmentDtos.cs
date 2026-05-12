using System.ComponentModel.DataAnnotations;

namespace GrievanceApi.DTOs.Department;

public class CreateDepartmentDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = null!;

    [StringLength(500)]
    public string Description { get; set; } = string.Empty;
}

public class UpdateDepartmentDto
{
    [StringLength(100, MinimumLength = 2)]
    public string? Name { get; set; }

    [StringLength(500)]
    public string? Description { get; set; }

    public bool? IsActive { get; set; }
}

public class DepartmentResponseDto
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public int ManagerCount { get; set; }
    public int ComplaintCount { get; set; }
}
