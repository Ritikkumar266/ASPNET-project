using MongoDB.Driver;
using GrievanceApi.Models;
using GrievanceApi.DTOs.Feedback;

namespace GrievanceApi.Services;

public class FeedbackService
{
    private readonly IMongoCollection<Feedback> _feedbacks;
    private readonly IMongoCollection<Complaint> _complaints;

    public FeedbackService(IMongoDatabase database)
    {
        _feedbacks = database.GetCollection<Feedback>("feedbacks");
        _complaints = database.GetCollection<Complaint>("complaints");
    }

    public async Task<FeedbackResponseDto> CreateAsync(CreateFeedbackDto dto, string citizenId, string citizenName)
    {
        var complaint = await _complaints.Find(c => c.Id == dto.ComplaintId).FirstOrDefaultAsync()
            ?? throw new Exception("Complaint not found");

        if (complaint.CitizenId != citizenId)
            throw new Exception("You can only give feedback on your own complaints");

        if (complaint.Status != ComplaintStatus.Resolved)
            throw new Exception("Feedback can only be given on resolved complaints");

        var existing = await _feedbacks.Find(f => f.ComplaintId == dto.ComplaintId && f.CitizenId == citizenId).FirstOrDefaultAsync();
        if (existing != null)
            throw new Exception("Feedback already submitted for this complaint");

        var feedback = new Feedback
        {
            ComplaintId = dto.ComplaintId,
            CitizenId = citizenId,
            CitizenName = citizenName,
            DepartmentId = complaint.DepartmentId,
            ComplaintTitle = complaint.Title,
            Rating = dto.Rating,
            Comment = dto.Comment
        };

        await _feedbacks.InsertOneAsync(feedback);
        return MapToDto(feedback);
    }

    public async Task<FeedbackResponseDto?> GetByComplaintAsync(string complaintId)
    {
        var feedback = await _feedbacks.Find(f => f.ComplaintId == complaintId).FirstOrDefaultAsync();
        return feedback == null ? null : MapToDto(feedback);
    }

    public async Task<List<FeedbackResponseDto>> GetAllAsync()
    {
        var feedbacks = await _feedbacks.Find(_ => true)
            .SortByDescending(f => f.CreatedAt)
            .ToListAsync();
        return feedbacks.Select(MapToDto).ToList();
    }

    public async Task<List<FeedbackResponseDto>> GetByDepartmentAsync(string departmentId)
    {
        var feedbacks = await _feedbacks.Find(f => f.DepartmentId == departmentId)
            .SortByDescending(f => f.CreatedAt)
            .ToListAsync();
        return feedbacks.Select(MapToDto).ToList();
    }

    private static FeedbackResponseDto MapToDto(Feedback f)
    {
        return new FeedbackResponseDto
        {
            Id = f.Id,
            ComplaintId = f.ComplaintId,
            ComplaintTitle = f.ComplaintTitle,
            CitizenId = f.CitizenId,
            CitizenName = f.CitizenName,
            DepartmentId = f.DepartmentId,
            Rating = f.Rating,
            Comment = f.Comment,
            CreatedAt = f.CreatedAt
        };
    }
}
