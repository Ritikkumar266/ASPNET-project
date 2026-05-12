using MongoDB.Driver;
using GrievanceApi.Models;
using GrievanceApi.DTOs.Department;

namespace GrievanceApi.Services;

public class DepartmentService
{
    private readonly IMongoCollection<Department> _departments;
    private readonly IMongoCollection<User> _users;
    private readonly IMongoCollection<Complaint> _complaints;

    public DepartmentService(IMongoDatabase database)
    {
        _departments = database.GetCollection<Department>("departments");
        _users = database.GetCollection<User>("users");
        _complaints = database.GetCollection<Complaint>("complaints");
    }

    public async Task<DepartmentResponseDto> CreateAsync(CreateDepartmentDto dto)
    {
        var existing = await _departments.Find(d => d.Name.ToLower() == dto.Name.ToLower()).FirstOrDefaultAsync();
        if (existing != null)
            throw new Exception("Department already exists");

        var department = new Department
        {
            Name = dto.Name,
            Description = dto.Description
        };

        await _departments.InsertOneAsync(department);
        return MapToDto(department, 0, 0);
    }

    public async Task<List<DepartmentResponseDto>> GetAllAsync()
    {
        var departments = await _departments.Find(_ => true)
            .SortBy(d => d.Name)
            .ToListAsync();

        var result = new List<DepartmentResponseDto>();
        foreach (var d in departments)
        {
            var managerCount = (int)await _users.CountDocumentsAsync(u => u.DepartmentId == d.Id && u.Role == UserRole.Department);
            var complaintCount = (int)await _complaints.CountDocumentsAsync(c => c.DepartmentId == d.Id);
            result.Add(MapToDto(d, managerCount, complaintCount));
        }
        return result;
    }

    public async Task<DepartmentResponseDto?> GetByIdAsync(string id)
    {
        var department = await _departments.Find(d => d.Id == id).FirstOrDefaultAsync();
        if (department == null) return null;

        var managerCount = (int)await _users.CountDocumentsAsync(u => u.DepartmentId == id && u.Role == UserRole.Department);
        var complaintCount = (int)await _complaints.CountDocumentsAsync(c => c.DepartmentId == id);
        return MapToDto(department, managerCount, complaintCount);
    }

    public async Task<DepartmentResponseDto?> UpdateAsync(string id, UpdateDepartmentDto dto)
    {
        var updates = new List<UpdateDefinition<Department>>();

        if (!string.IsNullOrEmpty(dto.Name))
            updates.Add(Builders<Department>.Update.Set(d => d.Name, dto.Name));

        if (dto.Description != null)
            updates.Add(Builders<Department>.Update.Set(d => d.Description, dto.Description));

        if (dto.IsActive.HasValue)
            updates.Add(Builders<Department>.Update.Set(d => d.IsActive, dto.IsActive.Value));

        if (updates.Count == 0) return await GetByIdAsync(id);

        var combined = Builders<Department>.Update.Combine(updates);
        await _departments.UpdateOneAsync(d => d.Id == id, combined);
        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _departments.DeleteOneAsync(d => d.Id == id);
        return result.DeletedCount > 0;
    }

    private static DepartmentResponseDto MapToDto(Department d, int managerCount, int complaintCount)
    {
        return new DepartmentResponseDto
        {
            Id = d.Id,
            Name = d.Name,
            Description = d.Description,
            IsActive = d.IsActive,
            CreatedAt = d.CreatedAt,
            ManagerCount = managerCount,
            ComplaintCount = complaintCount
        };
    }
}
