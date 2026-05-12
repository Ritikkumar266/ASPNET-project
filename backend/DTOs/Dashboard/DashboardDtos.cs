namespace GrievanceApi.DTOs.Dashboard;

public class AdminDashboardDto
{
    public int TotalComplaints { get; set; }
    public int PendingComplaints { get; set; }
    public int AssignedComplaints { get; set; }
    public int InProgressComplaints { get; set; }
    public int ResolvedComplaints { get; set; }
    public int RejectedComplaints { get; set; }
    public int TotalUsers { get; set; }
    public int TotalDepartments { get; set; }
    public double AverageRating { get; set; }
    public List<DepartmentStatDto> DepartmentStats { get; set; } = new();
    public List<RecentComplaintDto> RecentComplaints { get; set; } = new();
    public Dictionary<string, int> PriorityDistribution { get; set; } = new();
    public Dictionary<string, int> CategoryDistribution { get; set; } = new();
}

public class DepartmentDashboardDto
{
    public int TotalAssigned { get; set; }
    public int PendingComplaints { get; set; }
    public int InProgressComplaints { get; set; }
    public int ResolvedComplaints { get; set; }
    public int RejectedComplaints { get; set; }
    public double AverageRating { get; set; }
    public int TotalFeedback { get; set; }
    public List<RecentComplaintDto> RecentComplaints { get; set; } = new();
    public Dictionary<string, int> PriorityDistribution { get; set; } = new();
}

public class CitizenDashboardDto
{
    public int TotalComplaints { get; set; }
    public int PendingComplaints { get; set; }
    public int InProgressComplaints { get; set; }
    public int ResolvedComplaints { get; set; }
    public int RejectedComplaints { get; set; }
    public List<RecentComplaintDto> RecentComplaints { get; set; } = new();
}

public class DepartmentStatDto
{
    public string DepartmentName { get; set; } = null!;
    public int TotalComplaints { get; set; }
    public int Resolved { get; set; }
    public int Pending { get; set; }
}

public class RecentComplaintDto
{
    public string Id { get; set; } = null!;
    public string TrackingId { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string Priority { get; set; } = null!;
    public string Category { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}
