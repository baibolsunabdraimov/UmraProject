using Microsoft.EntityFrameworkCore;
using UmrahTourApi.Data;
using UmrahTourApi.Models; // Убедись, что это пространство имен верное
using UmrahTourApi.Services.Interfaces;

namespace UmrahTourApi.Services.Implementations;

public class StatsService : IStatsService
{
    private readonly AppDbContext _context;

    public StatsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<SalesStatsDto> GetSalesStatsAsync()
    {
        var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);

        // 1. Получаем данные во временный список (Memory), чтобы избежать ошибок LINQ to Entities
        var flightsData = await _context.Flights
            .Include(f => f.Pilgrims)
            .Where(f => f.DepartureTime >= sixMonthsAgo)
            .ToListAsync();

        // Если данных нет совсем — возвращаем пустой объект, чтобы не было ошибки 500
        if (!flightsData.Any())
            return new SalesStatsDto { MonthlySales = new List<MonthlySales>(), TotalRevenue = 0 };

        var monthlySales = flightsData
            .SelectMany(f => f.Pilgrims.Select(p => new
            {
                FlightDate = f.DepartureTime,
                FlightPrice = f.TicketPrice
            }))
            .GroupBy(x => new { x.FlightDate.Year, x.FlightDate.Month })
            .Select(g => new MonthlySales
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                // Используем культуру для названия месяца
                MonthName = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMMM"),
                Revenue = g.Sum(x => x.FlightPrice),
                TicketCount = g.Count()
            })
            .OrderBy(x => x.Year).ThenBy(x => x.Month)
            .ToList();

        return new SalesStatsDto
        {
            MonthlySales = monthlySales,
            TotalRevenue = monthlySales.Sum(x => x.Revenue)
        };
    }

    public async Task<PilgrimsStatsDto> GetPilgrimsStatsAsync()
    {
        var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);

        var pilgrimsData = await _context.Pilgrims
            .Include(p => p.Flight)
            .Where(p => p.Flight != null && p.Flight.DepartureTime >= sixMonthsAgo)
            .ToListAsync();

        if (!pilgrimsData.Any())
            return new PilgrimsStatsDto { MonthlyPilgrims = new List<MonthlyPilgrims>(), TotalPilgrims = 0 };

        var monthlyPilgrims = pilgrimsData
            .GroupBy(x => new { x.Flight!.DepartureTime.Year, x.Flight.DepartureTime.Month })
            .Select(g => new MonthlyPilgrims
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                MonthName = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMMM"),
                Count = g.Count()
            })
            .OrderBy(x => x.Year).ThenBy(x => x.Month)
            .ToList();

        return new PilgrimsStatsDto
        {
            MonthlyPilgrims = monthlyPilgrims,
            TotalPilgrims = monthlyPilgrims.Sum(x => x.Count)
        };
    }

    public async Task<IEnumerable<GroupOccupancyDto>> GetGroupOccupancyAsync()
    {
        var groups = await _context.UmrahGroups
            .Include(g => g.Pilgrims)
            .Where(g => g.Status != GroupStatus.Completed) // Убедись, что GroupStatus виден тут
            .ToListAsync();

        if (!groups.Any()) return new List<GroupOccupancyDto>();

        return groups.Select(g => new GroupOccupancyDto
        {
            GroupId = g.Id,
            GroupName = g.Name,
            TotalSeats = g.MaxSeats,
            OccupiedSeats = (g.Pilgrims != null) ? g.Pilgrims.Count : 0,
            OccupancyPercentage = g.MaxSeats > 0
                ? Math.Round((double)((g.Pilgrims != null) ? g.Pilgrims.Count : 0) / g.MaxSeats * 100, 2)
                : 0
        }).ToList();
    }
}