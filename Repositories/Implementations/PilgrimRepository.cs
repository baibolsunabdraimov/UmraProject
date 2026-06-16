using Microsoft.EntityFrameworkCore;
using UmrahTourApi.Data;
using UmrahTourApi.Models;
using UmrahTourApi.Repositories.Interfaces;

namespace UmrahTourApi.Repositories.Implementations;

public class PilgrimRepository : Repository<Pilgrim>, IPilgrimRepository
{
    public PilgrimRepository(AppDbContext context) : base(context) { }

    public async Task<Pilgrim?> GetByIdWithDetailsAsync(int id)
    {
        return await _dbSet
            .Include(p => p.Group)
            .Include(p => p.Flight)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Pilgrim>> GetByGroupIdAsync(int groupId)
    {
        return await _dbSet
            .Include(p => p.Flight)
            .Where(p => p.GroupId == groupId)
            .ToListAsync();
    }

    public async Task<Pilgrim?> GetByPassportAsync(string passportNumber)
    {
        return await _dbSet.FirstOrDefaultAsync(p => p.PassportNumber == passportNumber);
    }

    public async Task<bool> HasFlightAsync(int pilgrimId)
    {
        var pilgrim = await _dbSet.FindAsync(pilgrimId);
        return pilgrim?.FlightId != null;
    }
}