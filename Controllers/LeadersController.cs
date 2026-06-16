using Microsoft.AspNetCore.Mvc;
using UmrahTourApi.Models;
using UmrahTourApi.Services.Implementations;

namespace UmrahTourApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeadersController : ControllerBase
{
    private readonly ILeaderService _service;

    public LeadersController(ILeaderService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Leader>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Leader>> GetById(int id)
    {
        var leader = await _service.GetByIdAsync(id);
        if (leader == null) return NotFound();
        return Ok(leader);
    }

    [HttpPost]
    public async Task<ActionResult<Leader>> Create(Leader leader)
    {
        var created = await _service.CreateAsync(leader);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}