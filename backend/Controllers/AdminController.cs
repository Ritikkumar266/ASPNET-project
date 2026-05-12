using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GrievanceApi.DTOs.User;
using GrievanceApi.Services;

namespace GrievanceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly UserService _userService;

    public AdminController(UserService userService)
    {
        _userService = userService;
    }

    [HttpPost("create-manager")]
    public async Task<IActionResult> CreateManager([FromBody] CreateManagerDto dto)
    {
        try
        {
            var result = await _userService.CreateManagerAsync(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var result = await _userService.GetAllUsersAsync();
        return Ok(result);
    }
}
