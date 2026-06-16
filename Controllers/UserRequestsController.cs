using Microsoft.AspNetCore.Mvc;
using UmrahTourApi.Models;
using UmrahTourApi.Services.Interfaces;

namespace UmrahTourApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserRequestsController : ControllerBase
{
    private readonly IUserRequestService _service;
    public UserRequestsController(IUserRequestService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpPost]
    public async Task<IActionResult> Create(UserRequest request) => Ok(await _service.CreateAsync(request));

    [HttpPost("{id}/approve")]
    public async Task<IActionResult> Approve(int id)
    {
        var success = await _service.ApproveRequestAsync(id);
        if (!success) return NotFound();
        return Ok(new { message = "Успешно! Паломник создан." });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}