using MongoDB.Driver;
using GrievanceApi.Models;
using GrievanceApi.DTOs.User;

namespace GrievanceApi.Services;

public class UserService
{
    private readonly IMongoCollection<User> _users;
    private readonly IMongoCollection<Department> _departments;

    public UserService(IMongoDatabase database)
    {
        _users = database.GetCollection<User>("users");
        _departments = database.GetCollection<Department>("departments");
    }

    public async Task<UserResponseDto> CreateManagerAsync(CreateManagerDto dto)
    {
        var existing = await _users.Find(u => u.Email == dto.Email.ToLower()).FirstOrDefaultAsync();
        if (existing != null) throw new Exception("Email already registered");

        var department = await _departments.Find(d => d.Id == dto.DepartmentId).FirstOrDefaultAsync()
            ?? throw new Exception("Department not found");

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Phone = dto.Phone,
            Role = UserRole.Department,
            DepartmentId = dto.DepartmentId
        };

        await _users.InsertOneAsync(user);

        return new UserResponseDto
        {
            Id = user.Id, FullName = user.FullName, Email = user.Email, Phone = user.Phone,
            Role = user.Role.ToString(), DepartmentId = user.DepartmentId,
            DepartmentName = department.Name, IsActive = user.IsActive, CreatedAt = user.CreatedAt
        };
    }

    public async Task<List<UserResponseDto>> GetAllUsersAsync()
    {
        var users = await _users.Find(_ => true).SortByDescending(u => u.CreatedAt).ToListAsync();
        var departments = await _departments.Find(_ => true).ToListAsync();
        var deptMap = departments.ToDictionary(d => d.Id, d => d.Name);

        return users.Select(u => new UserResponseDto
        {
            Id = u.Id, FullName = u.FullName, Email = u.Email, Phone = u.Phone,
            Role = u.Role.ToString(), DepartmentId = u.DepartmentId,
            DepartmentName = u.DepartmentId != null && deptMap.ContainsKey(u.DepartmentId) ? deptMap[u.DepartmentId] : null,
            IsActive = u.IsActive, CreatedAt = u.CreatedAt
        }).ToList();
    }
}
