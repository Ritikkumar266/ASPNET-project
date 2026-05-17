using MongoDB.Driver;
using GrievanceApi.Models;
using GrievanceApi.DTOs.Complaint;

namespace GrievanceApi.Services;

public class ComplaintService
{
    private readonly IMongoCollection<Complaint> _complaints;
    private readonly IMongoCollection<User> _users;
    private readonly IMongoCollection<Department> _departments;
    private readonly IMongoCollection<Feedback> _feedbacks;

    public ComplaintService(IMongoDatabase database)
    {
        _complaints = database.GetCollection<Complaint>("complaints");
        _users = database.GetCollection<User>("users");
        _departments = database.GetCollection<Department>("departments");
        _feedbacks = database.GetCollection<Feedback>("feedbacks");
    }

    public async Task<ComplaintResponseDto> CreateAsync(CreateComplaintDto dto, string citizenId, string citizenName, IFormFileCollection? images)
    {
        if (!Enum.TryParse<ComplaintPriority>(dto.Priority, true, out var priority))
            priority = ComplaintPriority.Medium;

        var trackingId = await GenerateTrackingId();

        // If citizen selected a department, auto-assign
        string? departmentId = null;
        string? departmentName = null;
        var initialStatus = ComplaintStatus.Pending;

        if (!string.IsNullOrEmpty(dto.DepartmentId))
        {
            var department = await _departments.Find(d => d.Id == dto.DepartmentId).FirstOrDefaultAsync();
            if (department != null)
            {
                departmentId = department.Id;
                departmentName = department.Name;
                initialStatus = ComplaintStatus.Assigned;
            }
        }

        var statusHistory = new List<StatusHistoryEntry>
        {
            new StatusHistoryEntry
            {
                Status = ComplaintStatus.Pending,
                Remarks = "Complaint submitted",
                ChangedBy = citizenId,
                ChangedByName = citizenName,
                ChangedAt = DateTime.UtcNow
            }
        };

        // Add assigned entry if auto-assigned to a department
        if (initialStatus == ComplaintStatus.Assigned)
        {
            statusHistory.Add(new StatusHistoryEntry
            {
                Status = ComplaintStatus.Assigned,
                Remarks = $"Auto-assigned to {departmentName}",
                ChangedBy = citizenId,
                ChangedByName = "System",
                ChangedAt = DateTime.UtcNow
            });
        }

        var complaint = new Complaint
        {
            TrackingId = trackingId,
            Title = dto.Title,
            Description = dto.Description,
            Category = dto.Category,
            Priority = priority,
            Status = initialStatus,
            Address = dto.Address,
            CitizenId = citizenId,
            CitizenName = citizenName,
            DepartmentId = departmentId,
            DepartmentName = departmentName,
            StatusHistory = statusHistory
        };

        // Process uploaded images (max 5, max 5MB each)
        if (images != null && images.Count > 0)
        {
            var imageUrls = new List<string>();
            foreach (var image in images.Take(5))
            {
                if (image.Length > 5 * 1024 * 1024)
                    throw new Exception($"Image '{image.FileName}' exceeds 5MB limit");

                var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
                if (!allowedTypes.Contains(image.ContentType.ToLower()))
                    throw new Exception($"Image '{image.FileName}' has unsupported format. Allowed: JPEG, PNG, GIF, WebP");

                using var ms = new MemoryStream();
                await image.CopyToAsync(ms);
                var base64 = Convert.ToBase64String(ms.ToArray());
                imageUrls.Add($"data:{image.ContentType};base64,{base64}");
            }
            complaint.ImageUrls = imageUrls;
        }

        await _complaints.InsertOneAsync(complaint);
        return MapToDto(complaint, false);
    }

    public async Task<List<ComplaintResponseDto>> GetByCitizenAsync(string citizenId)
    {
        var complaints = await _complaints.Find(c => c.CitizenId == citizenId)
            .SortByDescending(c => c.CreatedAt)
            .ToListAsync();

        var result = new List<ComplaintResponseDto>();
        foreach (var c in complaints)
        {
            var hasFeedback = await _feedbacks.Find(f => f.ComplaintId == c.Id && f.CitizenId == citizenId).AnyAsync();
            result.Add(MapToDto(c, hasFeedback));
        }
        return result;
    }

    public async Task<ComplaintResponseDto?> GetByIdAsync(string id)
    {
        var complaint = await _complaints.Find(c => c.Id == id).FirstOrDefaultAsync();
        if (complaint == null) return null;
        var hasFeedback = await _feedbacks.Find(f => f.ComplaintId == id).AnyAsync();
        return MapToDto(complaint, hasFeedback);
    }

    public async Task<List<ComplaintResponseDto>> GetAllAsync(string? status, string? priority, string? category, string? departmentId)
    {
        var filter = Builders<Complaint>.Filter.Empty;

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<ComplaintStatus>(status, true, out var s))
            filter &= Builders<Complaint>.Filter.Eq(c => c.Status, s);

        if (!string.IsNullOrEmpty(priority) && Enum.TryParse<ComplaintPriority>(priority, true, out var p))
            filter &= Builders<Complaint>.Filter.Eq(c => c.Priority, p);

        if (!string.IsNullOrEmpty(category))
            filter &= Builders<Complaint>.Filter.Eq(c => c.Category, category);

        if (!string.IsNullOrEmpty(departmentId))
            filter &= Builders<Complaint>.Filter.Eq(c => c.DepartmentId, departmentId);

        var complaints = await _complaints.Find(filter)
            .SortByDescending(c => c.CreatedAt)
            .ToListAsync();

        return complaints.Select(c => MapToDto(c, false)).ToList();
    }

    public async Task<List<ComplaintResponseDto>> GetByDepartmentAsync(string departmentId)
    {
        var complaints = await _complaints.Find(c => c.DepartmentId == departmentId)
            .SortByDescending(c => c.CreatedAt)
            .ToListAsync();

        return complaints.Select(c => MapToDto(c, false)).ToList();
    }

    public async Task<ComplaintResponseDto?> AssignAsync(string complaintId, string departmentId, string assignedBy)
    {
        var department = await _departments.Find(d => d.Id == departmentId).FirstOrDefaultAsync();
        if (department == null) throw new Exception("Department not found");

        var admin = await _users.Find(u => u.Id == assignedBy).FirstOrDefaultAsync();

        var update = Builders<Complaint>.Update
            .Set(c => c.DepartmentId, departmentId)
            .Set(c => c.DepartmentName, department.Name)
            .Set(c => c.AssignedBy, assignedBy)
            .Set(c => c.Status, ComplaintStatus.Assigned)
            .Set(c => c.UpdatedAt, DateTime.UtcNow)
            .Push(c => c.StatusHistory, new StatusHistoryEntry
            {
                Status = ComplaintStatus.Assigned,
                Remarks = $"Assigned to {department.Name}",
                ChangedBy = assignedBy,
                ChangedByName = admin?.FullName ?? "Admin",
                ChangedAt = DateTime.UtcNow
            });

        await _complaints.UpdateOneAsync(c => c.Id == complaintId, update);
        return await GetByIdAsync(complaintId);
    }

    public async Task<ComplaintResponseDto?> UpdateStatusAsync(string complaintId, UpdateStatusDto dto, string changedBy)
    {
        if (!Enum.TryParse<ComplaintStatus>(dto.Status, true, out var newStatus))
            throw new Exception("Invalid status");

        var user = await _users.Find(u => u.Id == changedBy).FirstOrDefaultAsync();

        var update = Builders<Complaint>.Update
            .Set(c => c.Status, newStatus)
            .Set(c => c.UpdatedAt, DateTime.UtcNow)
            .Push(c => c.StatusHistory, new StatusHistoryEntry
            {
                Status = newStatus,
                Remarks = dto.Remarks,
                ChangedBy = changedBy,
                ChangedByName = user?.FullName ?? "Unknown",
                ChangedAt = DateTime.UtcNow
            });

        await _complaints.UpdateOneAsync(c => c.Id == complaintId, update);
        return await GetByIdAsync(complaintId);
    }

    private async Task<string> GenerateTrackingId()
    {
        var today = DateTime.UtcNow.ToString("yyyyMMdd");
        var count = await _complaints.CountDocumentsAsync(
            Builders<Complaint>.Filter.Regex(c => c.TrackingId, $"^GRV-{today}"));
        return $"GRV-{today}-{(count + 1):D4}";
    }

    private static ComplaintResponseDto MapToDto(Complaint c, bool hasFeedback)
    {
        return new ComplaintResponseDto
        {
            Id = c.Id,
            TrackingId = c.TrackingId,
            Title = c.Title,
            Description = c.Description,
            Category = c.Category,
            Priority = c.Priority.ToString(),
            Status = c.Status.ToString(),
            Address = c.Address,
            CitizenId = c.CitizenId,
            CitizenName = c.CitizenName,
            DepartmentId = c.DepartmentId,
            DepartmentName = c.DepartmentName,
            StatusHistory = c.StatusHistory.Select(h => new StatusHistoryDto
            {
                Status = h.Status.ToString(),
                Remarks = h.Remarks,
                ChangedBy = h.ChangedBy,
                ChangedByName = h.ChangedByName,
                ChangedAt = h.ChangedAt
            }).ToList(),
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt,
            HasFeedback = hasFeedback,
            ImageUrls = c.ImageUrls ?? new List<string>()
        };
    }
}
