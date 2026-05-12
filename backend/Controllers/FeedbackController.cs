using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GrievanceApi.DTOs.Feedback;
using GrievanceApi.Services;
using System.Security.Claims;

namespace GrievanceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FeedbackController : ControllerBase
{
    private readonly FeedbackService _feedbackService;

    public FeedbackController(FeedbackService feedbackService)
    {
        _feedbackService = feedbackService;
    }

    [HttpPost]
    [Authorize(Roles = "Citizen")]
    public async Task<IActionResult> Create([FromBody] CreateFeedbackDto dto)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;
            var result = await _feedbackService.CreateAsync(dto, userId, userName);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("complaint/{complaintId}")]
    public async Task<IActionResult> GetByComplaint(string complaintId)
    {
        var result = await _feedbackService.GetByComplaintAsync(complaintId);
        return Ok(result);
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _feedbackService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("department")]
    [Authorize(Roles = "Department")]
    public async Task<IActionResult> GetByDepartment()
    {
        var deptId = User.FindFirst("departmentId")?.Value;
        if (string.IsNullOrEmpty(deptId))
            return BadRequest(new { message = "No department assigned" });
        var result = await _feedbackService.GetByDepartmentAsync(deptId);
        return Ok(result);
    }
}
