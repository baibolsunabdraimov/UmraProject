using Microsoft.AspNetCore.Mvc;
using UmrahTourApi.Models;
using UmrahTourApi.Services.Interfaces;

namespace UmrahTourApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class FlightsController : ControllerBase
{
    private readonly IFlightService _flightService;

    public FlightsController(IFlightService flightService)
    {
        _flightService = flightService;
    }

    /// <summary>Получить все рейсы</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Flight>>> GetAll()
    {
        var flights = await _flightService.GetAllFlightsAsync();
        return Ok(flights);
    }

    /// <summary>Получить рейс по ID</summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Flight>> GetById(int id)
    {
        var flight = await _flightService.GetFlightWithPilgrimsAsync(id);
        if (flight == null) return NotFound();
        return Ok(flight);
    }

    /// <summary>Создать новый рейс</summary>
    [HttpPost]
    public async Task<ActionResult<Flight>> Create([FromBody] Flight flight)
    {
        var created = await _flightService.CreateFlightAsync(flight);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Обновить рейс</summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Flight flight)
    {
        if (id != flight.Id) return BadRequest();
        
        var existing = await _flightService.GetFlightByIdAsync(id);
        if (existing == null) return NotFound();

        await _flightService.UpdateFlightAsync(flight);
        return NoContent();
    }

    /// <summary>Удалить рейс</summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await _flightService.GetFlightByIdAsync(id);
        if (existing == null) return NotFound();

        await _flightService.DeleteFlightAsync(id);
        return NoContent();
    }

    /// <summary>Получить доступные рейсы</summary>
    [HttpGet("available")]
    public async Task<ActionResult<IEnumerable<Flight>>> GetAvailable()
    {
        var flights = await _flightService.GetAvailableFlightsAsync();
        return Ok(flights);
    }
}