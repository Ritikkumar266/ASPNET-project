using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace GrievanceApi.Models;

public class Feedback
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonElement("complaintId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string ComplaintId { get; set; } = null!;

    [BsonElement("citizenId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string CitizenId { get; set; } = null!;

    [BsonElement("citizenName")]
    public string CitizenName { get; set; } = string.Empty;

    [BsonElement("departmentId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? DepartmentId { get; set; }

    [BsonElement("complaintTitle")]
    public string ComplaintTitle { get; set; } = string.Empty;

    [BsonElement("rating")]
    public int Rating { get; set; }

    [BsonElement("comment")]
    public string Comment { get; set; } = string.Empty;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
