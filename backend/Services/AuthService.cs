using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using GrievanceApi.Models;
using GrievanceApi.DTOs.Auth;

namespace GrievanceApi.Services;

public class AuthService
{
    private readonly IMongoCollection<User> _users;
    private readonly IMongoCollection<Department> _departments;
    private readonly IConfiguration _config;

    public AuthService(IMongoDatabase database, IConfiguration config)
    {
        _users = database.GetCollection<User>("users");
        _departments = database.GetCollection<Department>("departments");
        _config = config;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var existing = await _users.Find(u => u.Email == dto.Email.ToLower()).FirstOrDefaultAsync();
        if (existing != null)
            throw new Exception("Email already registered");

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Phone = dto.Phone,
            Role = UserRole.Citizen
        };

        await _users.InsertOneAsync(user);
        return await GenerateAuthResponse(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _users.Find(u => u.Email == dto.Email.ToLower()).FirstOrDefaultAsync();
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new Exception("Invalid email or password");

        if (!user.IsActive)
            throw new Exception("Account is deactivated");

        return await GenerateAuthResponse(user);
    }

    public async Task<UserProfileDto> GetProfileAsync(string userId)
    {
        var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync()
            ?? throw new Exception("User not found");

        string? departmentName = null;
        if (user.DepartmentId != null)
        {
            var dept = await _departments.Find(d => d.Id == user.DepartmentId).FirstOrDefaultAsync();
            departmentName = dept?.Name;
        }

        return new UserProfileDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Phone = user.Phone,
            Role = user.Role.ToString(),
            DepartmentId = user.DepartmentId,
            DepartmentName = departmentName,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<UserProfileDto> UpdateProfileAsync(string userId, UpdateProfileDto dto)
    {
        var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync()
            ?? throw new Exception("User not found");

        var updates = new List<UpdateDefinition<User>>();

        if (!string.IsNullOrEmpty(dto.FullName))
            updates.Add(Builders<User>.Update.Set(u => u.FullName, dto.FullName));

        if (!string.IsNullOrEmpty(dto.Phone))
            updates.Add(Builders<User>.Update.Set(u => u.Phone, dto.Phone));

        if (!string.IsNullOrEmpty(dto.CurrentPassword) && !string.IsNullOrEmpty(dto.NewPassword))
        {
            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
                throw new Exception("Current password is incorrect");
            updates.Add(Builders<User>.Update.Set(u => u.PasswordHash, BCrypt.Net.BCrypt.HashPassword(dto.NewPassword)));
        }

        if (updates.Count > 0)
        {
            updates.Add(Builders<User>.Update.Set(u => u.UpdatedAt, DateTime.UtcNow));
            var combined = Builders<User>.Update.Combine(updates);
            await _users.UpdateOneAsync(u => u.Id == userId, combined);
        }

        return await GetProfileAsync(userId);
    }

    private async Task<AuthResponseDto> GenerateAuthResponse(User user)
    {
        string? departmentName = null;
        if (user.DepartmentId != null)
        {
            var dept = await _departments.Find(d => d.Id == user.DepartmentId).FirstOrDefaultAsync();
            departmentName = dept?.Name;
        }

        var token = GenerateJwtToken(user);
        return new AuthResponseDto
        {
            Token = token,
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString(),
            DepartmentId = user.DepartmentId,
            DepartmentName = departmentName
        };
    }

    private string GenerateJwtToken(User user)
    {
        var secret = _config["JwtSettings:Secret"]
            ?? Environment.GetEnvironmentVariable("JWT_SECRET")
            ?? throw new Exception("JWT secret not configured");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("departmentId", user.DepartmentId ?? "")
        };

        var issuer = _config["JwtSettings:Issuer"]
            ?? Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "GrievanceApi";
        var audience = _config["JwtSettings:Audience"]
            ?? Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "GrievanceApp";

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class UserProfileDto
{
    public string Id { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Phone { get; set; } = string.Empty;
    public string Role { get; set; } = null!;
    public string? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public DateTime CreatedAt { get; set; }
}
