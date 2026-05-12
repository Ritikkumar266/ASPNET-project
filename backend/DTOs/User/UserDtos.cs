using System.ComponentModel.DataAnnotations;

namespace GrievanceApi.DTOs.User;

public class CreateManagerDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string FullName { get; set; } = null!;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = null!;

    [Phone]
    public string Phone { get; set; } = string.Empty;

    [Required]
    public string DepartmentId { get; set; } = null!;
}

public class UserResponseDto
{
    public string Id { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Phone { get; set; } = string.Empty;
    public string Role { get; set; } = null!;
    public string? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
