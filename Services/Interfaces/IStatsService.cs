namespace UmrahTourApi.Services.Interfaces;

public interface IStatsService
{
    Task<SalesStatsDto> GetSalesStatsAsync();
    Task<PilgrimsStatsDto> GetPilgrimsStatsAsync();
    Task<IEnumerable<GroupOccupancyDto>> GetGroupOccupancyAsync();
}

public class SalesStatsDto
{
    public List<MonthlySales> MonthlySales { get; set; } = new();
    public decimal TotalRevenue { get; set; }
}

public class MonthlySales
{
    public int Month { get; set; }
    public int Year { get; set; }
    public string MonthName { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int TicketCount { get; set; }
}

public class PilgrimsStatsDto
{
    public List<MonthlyPilgrims> MonthlyPilgrims { get; set; } = new();
    public int TotalPilgrims { get; set; }
}

public class MonthlyPilgrims
{
    public int Month { get; set; }
    public int Year { get; set; }
    public string MonthName { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class GroupOccupancyDto
{
    public int GroupId { get; set; }
    public string GroupName { get; set; } = string.Empty;
    public int TotalSeats { get; set; }
    public int OccupiedSeats { get; set; }
    public double OccupancyPercentage { get; set; }
}