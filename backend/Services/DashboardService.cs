using MongoDB.Driver;
using GrievanceApi.Models;
using GrievanceApi.DTOs.Dashboard;

namespace GrievanceApi.Services;

public class DashboardService
{
    private readonly IMongoCollection<Complaint> _complaints;
    private readonly IMongoCollection<User> _users;
    private readonly IMongoCollection<Department> _departments;
    private readonly IMongoCollection<Feedback> _feedbacks;

    public DashboardService(IMongoDatabase database)
    {
        _complaints = database.GetCollection<Complaint>("complaints");
        _users = database.GetCollection<User>("users");
        _departments = database.GetCollection<Department>("departments");
        _feedbacks = database.GetCollection<Feedback>("feedbacks");
    }

    public async Task<AdminDashboardDto> GetAdminDashboardAsync()
    {
        var all = await _complaints.Find(_ => true).ToListAsync();
        var feedbacks = await _feedbacks.Find(_ => true).ToListAsync();
        var departments = await _departments.Find(_ => true).ToListAsync();

        var deptStats = new List<DepartmentStatDto>();
        foreach (var d in departments)
        {
            var deptComplaints = all.Where(c => c.DepartmentId == d.Id).ToList();
            deptStats.Add(new DepartmentStatDto
            {
                DepartmentName = d.Name,
                TotalComplaints = deptComplaints.Count,
                Resolved = deptComplaints.Count(c => c.Status == ComplaintStatus.Resolved),
                Pending = deptComplaints.Count(c => c.Status == ComplaintStatus.Pending || c.Status == ComplaintStatus.Assigned)
            });
        }

        return new AdminDashboardDto
        {
            TotalComplaints = all.Count,
            PendingComplaints = all.Count(c => c.Status == ComplaintStatus.Pending),
            AssignedComplaints = all.Count(c => c.Status == ComplaintStatus.Assigned),
            InProgressComplaints = all.Count(c => c.Status == ComplaintStatus.InProgress),
            ResolvedComplaints = all.Count(c => c.Status == ComplaintStatus.Resolved),
            RejectedComplaints = all.Count(c => c.Status == ComplaintStatus.Rejected),
            TotalUsers = (int)await _users.CountDocumentsAsync(_ => true),
            TotalDepartments = departments.Count,
            AverageRating = feedbacks.Count > 0 ? Math.Round(feedbacks.Average(f => f.Rating), 1) : 0,
            DepartmentStats = deptStats,
            RecentComplaints = all.OrderByDescending(c => c.CreatedAt).Take(10)
                .Select(c => new RecentComplaintDto
                {
                    Id = c.Id, TrackingId = c.TrackingId, Title = c.Title,
                    Status = c.Status.ToString(), Priority = c.Priority.ToString(),
                    Category = c.Category, CreatedAt = c.CreatedAt
                }).ToList(),
            PriorityDistribution = all.GroupBy(c => c.Priority.ToString())
                .ToDictionary(g => g.Key, g => g.Count()),
            CategoryDistribution = all.GroupBy(c => c.Category)
                .ToDictionary(g => g.Key, g => g.Count())
        };
    }

    public async Task<DepartmentDashboardDto> GetDepartmentDashboardAsync(string departmentId)
    {
        var all = await _complaints.Find(c => c.DepartmentId == departmentId).ToListAsync();
        var feedbacks = await _feedbacks.Find(f => f.DepartmentId == departmentId).ToListAsync();

        return new DepartmentDashboardDto
        {
            TotalAssigned = all.Count,
            PendingComplaints = all.Count(c => c.Status == ComplaintStatus.Pending || c.Status == ComplaintStatus.Assigned),
            InProgressComplaints = all.Count(c => c.Status == ComplaintStatus.InProgress),
            ResolvedComplaints = all.Count(c => c.Status == ComplaintStatus.Resolved),
            RejectedComplaints = all.Count(c => c.Status == ComplaintStatus.Rejected),
            AverageRating = feedbacks.Count > 0 ? Math.Round(feedbacks.Average(f => f.Rating), 1) : 0,
            TotalFeedback = feedbacks.Count,
            RecentComplaints = all.OrderByDescending(c => c.CreatedAt).Take(10)
                .Select(c => new RecentComplaintDto
                {
                    Id = c.Id, TrackingId = c.TrackingId, Title = c.Title,
                    Status = c.Status.ToString(), Priority = c.Priority.ToString(),
                    Category = c.Category, CreatedAt = c.CreatedAt
                }).ToList(),
            PriorityDistribution = all.GroupBy(c => c.Priority.ToString())
                .ToDictionary(g => g.Key, g => g.Count())
        };
    }

    public async Task<CitizenDashboardDto> GetCitizenDashboardAsync(string citizenId)
    {
        var all = await _complaints.Find(c => c.CitizenId == citizenId).ToListAsync();

        return new CitizenDashboardDto
        {
            TotalComplaints = all.Count,
            PendingComplaints = all.Count(c => c.Status == ComplaintStatus.Pending || c.Status == ComplaintStatus.Assigned),
            InProgressComplaints = all.Count(c => c.Status == ComplaintStatus.InProgress),
            ResolvedComplaints = all.Count(c => c.Status == ComplaintStatus.Resolved),
            RejectedComplaints = all.Count(c => c.Status == ComplaintStatus.Rejected),
            RecentComplaints = all.OrderByDescending(c => c.CreatedAt).Take(5)
                .Select(c => new RecentComplaintDto
                {
                    Id = c.Id, TrackingId = c.TrackingId, Title = c.Title,
                    Status = c.Status.ToString(), Priority = c.Priority.ToString(),
                    Category = c.Category, CreatedAt = c.CreatedAt
                }).ToList()
        };
    }
}
