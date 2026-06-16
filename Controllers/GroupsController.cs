using Microsoft.AspNetCore.Mvc;
using UmrahTourApi.Models;
using UmrahTourApi.Services.Interfaces;

namespace UmrahTourApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class GroupsController : ControllerBase
{
    private readonly IUmrahGroupService _groupService;

    public GroupsController(IUmrahGroupService groupService)
    {
        _groupService = groupService;
    }

    /// <summary>Получить все группы</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UmrahGroup>>> GetAll()
    {
        var groups = await _groupService.GetAllGroupsAsync();
        return Ok(groups);
    }

    /// <summary>Получить группу по ID</summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<UmrahGroup>> GetById(int id)
    {
        var group = await _groupService.GetGroupWithDetailsAsync(id);
        if (group == null) return NotFound();
        return Ok(group);
    }

    /// <summary>Создать новую группу</summary>
    [HttpPost]
    public async Task<ActionResult<UmrahGroup>> Create([FromBody] UmrahGroup group)
    {
        var created = await _groupService.CreateGroupAsync(group);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Обновить группу</summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UmrahGroup group)
    {
        if (id != group.Id) return BadRequest();
        
        var existing = await _groupService.GetGroupByIdAsync(id);
        if (existing == null) return NotFound();

        await _groupService.UpdateGroupAsync(group);
        return NoContent();
    }

    /// <summary>Удалить группу</summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await _groupService.GetGroupByIdAsync(id);
        if (existing == null) return NotFound();

        await _groupService.DeleteGroupAsync(id);
        return NoContent();
    }

    /// <summary>Добавить паломника в группу (с проверкой мест)</summary>
    [HttpPost("{groupId}/pilgrims/{pilgrimId}")]
    public async Task<IActionResult> AddPilgrim(int groupId, int pilgrimId)
    {
        var result = await _groupService.AddPilgrimToGroupAsync(groupId, pilgrimId);
        if (!result) return BadRequest(new { message = "Нет свободных мест или группа/паломник не найдены" });
        return Ok(new { message = "Паломник добавлен в группу" });
    }

    /// <summary>Получить количество свободных мест</summary>
    [HttpGet("{id}/available-seats")]
    public async Task<ActionResult<object>> GetAvailableSeats(int id)
    {
        var seats = await _groupService.GetAvailableSeatsAsync(id);
        return Ok(new { groupId = id, availableSeats = seats });
    }
}