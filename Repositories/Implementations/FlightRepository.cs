using Microsoft.EntityFrameworkCore;
using UmrahTourApi.Data;
using UmrahTourApi.Models;
using UmrahTourApi.Repositories.Interfaces;

namespace UmrahTourApi.Repositories.Implementations;

public class FlightRepository : Repository<Flight>, IFlightRepository
{
    public FlightRepository(AppDbContext context) : base(context) { }

    public async Task<Flight?> GetByIdWithPilgrimsAsync(int id)
    {
        return await _dbSet
            .Include(f => f.Pilgrims)
            .FirstOrDefaultAsync(f => f.Id == id);
    }

    public async Task<IEnumerable<Flight>> GetAvailableFlightsAsync()
    {
        return await _dbSet
            .Where(f => f.DepartureTime > DateTime.UtcNow)
            .OrderBy(f => f.DepartureTime)
            .ToListAsync();
    }
}