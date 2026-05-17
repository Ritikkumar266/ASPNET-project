using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GrievanceApi.DTOs.Complaint;
using GrievanceApi.Services;
using System.Security.Claims;

namespace GrievanceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ComplaintsController : ControllerBase
{
    private readonly ComplaintService _complaintService;

    public ComplaintsController(ComplaintService complaintService)
    {
        _complaintService = complaintService;
    }

    [HttpPost]
    [Authorize(Roles = "Citizen")]
    [RequestSizeLimit(30 * 1024 * 1024)] // 30MB max for images
    public async Task<IActionResult> Create([FromForm] CreateComplaintDto dto)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;
            var images = Request.Form.Files;
            var result = await _complaintService.CreateAsync(dto, userId, userName, images);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("my")]
    [Authorize(Roles = "Citizen")]
    public async Task<IActionResult> GetMy()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        var result = await _complaintService.GetByCitizenAsync(userId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await _complaintService.GetByIdAsync(id);
        if (result == null) return NotFound(new { message = "Complaint not found" });

        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var deptId = User.FindFirst("departmentId")?.Value;

        if (role == "Citizen" && result.CitizenId != userId)
            return Forbid();
        if (role == "Department" && result.DepartmentId != deptId)
            return Forbid();

        return Ok(result);
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? status, [FromQuery] string? priority,
        [FromQuery] string? category, [FromQuery] string? departmentId)
    {
        var result = await _complaintService.GetAllAsync(status, priority, category, departmentId);
        return Ok(result);
    }

    [HttpGet("department")]
    [Authorize(Roles = "Department")]
    public async Task<IActionResult> GetByDepartment()
    {
        var deptId = User.FindFirst("departmentId")?.Value;
        if (string.IsNullOrEmpty(deptId))
            return BadRequest(new { message = "No department assigned" });
        var result = await _complaintService.GetByDepartmentAsync(deptId);
        return Ok(result);
    }

    [HttpPut("{id}/assign")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Assign(string id, [FromBody] AssignComplaintDto dto)
    {
        try
        {
            var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            var result = await _complaintService.AssignAsync(id, dto.DepartmentId, adminId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin,Department")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateStatusDto dto)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            var result = await _complaintService.UpdateStatusAsync(id, dto, userId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
