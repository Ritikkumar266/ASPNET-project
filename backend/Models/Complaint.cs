using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace GrievanceApi.Models;

public enum ComplaintPriority
{
    Low,
    Medium,
    High,
    Critical
}

public enum ComplaintStatus
{
    Pending,
    Assigned,
    InProgress,
    Resolved,
    Rejected
}

public class StatusHistoryEntry
{
    [BsonElement("status")]
    [BsonRepresentation(BsonType.String)]
    public ComplaintStatus Status { get; set; }

    [BsonElement("remarks")]
    public string Remarks { get; set; } = string.Empty;

    [BsonElement("changedBy")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string ChangedBy { get; set; } = null!;

    [BsonElement("changedByName")]
    public string ChangedByName { get; set; } = string.Empty;

    [BsonElement("changedAt")]
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
}

public class Complaint
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonElement("trackingId")]
    public string TrackingId { get; set; } = null!;

    [BsonElement("title")]
    public string Title { get; set; } = null!;

    [BsonElement("description")]
    public string Description { get; set; } = null!;

    [BsonElement("category")]
    public string Category { get; set; } = null!;

    [BsonElement("priority")]
    [BsonRepresentation(BsonType.String)]
    public ComplaintPriority Priority { get; set; } = ComplaintPriority.Medium;

    [BsonElement("status")]
    [BsonRepresentation(BsonType.String)]
    public ComplaintStatus Status { get; set; } = ComplaintStatus.Pending;

    [BsonElement("address")]
    public string Address { get; set; } = string.Empty;

    [BsonElement("citizenId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string CitizenId { get; set; } = null!;

    [BsonElement("citizenName")]
    public string CitizenName { get; set; } = string.Empty;

    [BsonElement("departmentId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? DepartmentId { get; set; }

    [BsonElement("departmentName")]
    public string? DepartmentName { get; set; }

    [BsonElement("assignedBy")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? AssignedBy { get; set; }

    [BsonElement("statusHistory")]
    public List<StatusHistoryEntry> StatusHistory { get; set; } = new();

    [BsonElement("imageUrls")]
    public List<string> ImageUrls { get; set; } = new();

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
