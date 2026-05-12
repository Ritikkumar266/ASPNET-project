using System.ComponentModel.DataAnnotations;

namespace GrievanceApi.DTOs.Auth;

public class RegisterDto
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
}

public class LoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    public string Password { get; set; } = null!;
}

public class AuthResponseDto
{
    public string Token { get; set; } = null!;
    public string Id { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
}

public class UpdateProfileDto
{
    [StringLength(100, MinimumLength = 2)]
    public string? FullName { get; set; }

    [Phone]
    public string? Phone { get; set; }

    [StringLength(100, MinimumLength = 6)]
    public string? CurrentPassword { get; set; }

    [StringLength(100, MinimumLength = 6)]
    public string? NewPassword { get; set; }
}
