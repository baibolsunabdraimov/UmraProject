using Microsoft.AspNetCore.Mvc;
using UmrahTourApi.Services.Interfaces;

namespace UmrahTourApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class StatsController : ControllerBase
{
    private readonly IStatsService _statsService;

    public StatsController(IStatsService statsService)
    {
        _statsService = statsService;
    }

    /// <summary>Получить статистику продаж за последние 6 месяцев</summary>
    [HttpGet("sales")]
    public async Task<ActionResult<SalesStatsDto>> GetSalesStats()
    {
        var stats = await _statsService.GetSalesStatsAsync();
        return Ok(stats);
    }

    /// <summary>Получить статистику паломников по месяцам</summary>
    [HttpGet("pilgrims")]
    public async Task<ActionResult<PilgrimsStatsDto>> GetPilgrimsStats()
    {
        var stats = await _statsService.GetPilgrimsStatsAsync();
        return Ok(stats);
    }

    /// <summary>Получить заполненность текущих групп</summary>
    [HttpGet("group-occupancy")]
    public async Task<ActionResult<IEnumerable<GroupOccupancyDto>>> GetGroupOccupancy()
    {
        var occupancy = await _statsService.GetGroupOccupancyAsync();
        return Ok(occupancy);
    }
}