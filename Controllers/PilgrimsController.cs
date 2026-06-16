using Microsoft.AspNetCore.Mvc;
using UmrahTourApi.Models;
using UmrahTourApi.Services.Interfaces;

namespace UmrahTourApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class PilgrimsController : ControllerBase
{
    private readonly IPilgrimService _pilgrimService;

    public PilgrimsController(IPilgrimService pilgrimService)
    {
        _pilgrimService = pilgrimService;
    }

    /// <summary>Получить всех паломников</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pilgrim>>> GetAll()
    {
        var pilgrims = await _pilgrimService.GetAllPilgrimsAsync();
        return Ok(pilgrims);
    }

    /// <summary>Получить паломника по ID</summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Pilgrim>> GetById(int id)
    {
        var pilgrim = await _pilgrimService.GetPilgrimWithDetailsAsync(id);
        if (pilgrim == null) return NotFound();
        return Ok(pilgrim);
    }

    /// <summary>Создать нового паломника</summary>
    [HttpPost]
    public async Task<ActionResult<Pilgrim>> Create([FromBody] Pilgrim pilgrim)
    {
        var created = await _pilgrimService.CreatePilgrimAsync(pilgrim);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Обновить паломника</summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Pilgrim pilgrim)
    {
        if (id != pilgrim.Id) return BadRequest();
        
        var existing = await _pilgrimService.GetPilgrimByIdAsync(id);
        if (existing == null) return NotFound();

        await _pilgrimService.UpdatePilgrimAsync(pilgrim);
        return NoContent();
    }

    /// <summary>Удалить паломника</summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await _pilgrimService.GetPilgrimByIdAsync(id);
        if (existing == null) return NotFound();

        await _pilgrimService.DeletePilgrimAsync(id);
        return NoContent();
    }

    /// <summary>Получить паломников группы</summary>
    [HttpGet("group/{groupId}")]
    public async Task<ActionResult<IEnumerable<Pilgrim>>> GetByGroup(int groupId)
    {
        var pilgrims = await _pilgrimService.GetPilgrimsByGroupAsync(groupId);
        return Ok(pilgrims);
    }

    /// <summary>Привязать билет к паломнику</summary>
    [HttpPost("{pilgrimId}/assign-flight/{flightId}")]
    public async Task<IActionResult> AssignFlight(int pilgrimId, int flightId)
    {
        var result = await _pilgrimService.AssignFlightAsync(pilgrimId, flightId);
        if (!result) return BadRequest(new { message = "Паломник или рейс не найдены" });
        return Ok(new { message = "Билет успешно привязан" });
    }

    /// <summary>Отвязать билет от паломника</summary>
    [HttpPost("{pilgrimId}/remove-flight")]
    public async Task<IActionResult> RemoveFlight(int pilgrimId)
    {
        var result = await _pilgrimService.RemoveFlightAsync(pilgrimId);
        if (!result) return BadRequest(new { message = "Паломник не найден" });
        return Ok(new { message = "Билет отвязан" });
    }
}