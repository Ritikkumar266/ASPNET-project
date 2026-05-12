using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GrievanceApi.Services;
using System.Security.Claims;

namespace GrievanceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly DashboardService _dashboardService;

    public DashboardController(DashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAdminDashboard()
    {
        var result = await _dashboardService.GetAdminDashboardAsync();
        return Ok(result);
    }

    [HttpGet("department")]
    [Authorize(Roles = "Department")]
    public async Task<IActionResult> GetDepartmentDashboard()
    {
        var deptId = User.FindFirst("departmentId")?.Value;
        if (string.IsNullOrEmpty(deptId))
            return BadRequest(new { message = "No department assigned" });
        var result = await _dashboardService.GetDepartmentDashboardAsync(deptId);
        return Ok(result);
    }

    [HttpGet("citizen")]
    [Authorize(Roles = "Citizen")]
    public async Task<IActionResult> GetCitizenDashboard()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        var result = await _dashboardService.GetCitizenDashboardAsync(userId);
        return Ok(result);
    }
}
