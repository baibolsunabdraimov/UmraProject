using Microsoft.AspNetCore.Mvc;
using UmrahTourApi.Models;
using UmrahTourApi.Services.Interfaces;

namespace UmrahTourApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class MeetingsController : ControllerBase
{
    private readonly IMeetingService _meetingService;

    public MeetingsController(IMeetingService meetingService)
    {
        _meetingService = meetingService;
    }

    /// <summary>Получить все встречи</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Meeting>>> GetAll()
    {
        var meetings = await _meetingService.GetAllMeetingsAsync();
        return Ok(meetings);
    }

    /// <summary>Получить встречу по ID</summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Meeting>> GetById(int id)
    {
        var meeting = await _meetingService.GetMeetingByIdAsync(id);
        if (meeting == null) return NotFound();
        return Ok(meeting);
    }

    /// <summary>Создать новую встречу</summary>
    [HttpPost]
    public async Task<ActionResult<Meeting>> Create([FromBody] Meeting meeting)
    {
        var created = await _meetingService.CreateMeetingAsync(meeting);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Обновить встречу</summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Meeting meeting)
    {
        if (id != meeting.Id) return BadRequest();
        
        var existing = await _meetingService.GetMeetingByIdAsync(id);
        if (existing == null) return NotFound();

        await _meetingService.UpdateMeetingAsync(meeting);
        return NoContent();
    }

    /// <summary>Удалить встречу</summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await _meetingService.GetMeetingByIdAsync(id);
        if (existing == null) return NotFound();

        await _meetingService.DeleteMeetingAsync(id);
        return NoContent();
    }

    /// <summary>Получить встречи группы</summary>
    [HttpGet("group/{groupId}")]
    public async Task<ActionResult<IEnumerable<Meeting>>> GetByGroup(int groupId)
    {
        var meetings = await _meetingService.GetMeetingsByGroupAsync(groupId);
        return Ok(meetings);
    }
}