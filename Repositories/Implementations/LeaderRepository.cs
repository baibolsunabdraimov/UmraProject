using Microsoft.EntityFrameworkCore;
using UmrahTourApi.Data;
using UmrahTourApi.Models;
using UmrahTourApi.Repositories.Interfaces;

namespace UmrahTourApi.Repositories.Implementations;

public interface ILeaderRepository
{
    Task<IEnumerable<Leader>> GetAllAsync();
    Task<Leader?> GetByIdAsync(int id);
    Task<Leader> CreateAsync(Leader leader);
    Task UpdateAsync(Leader leader);
    Task DeleteAsync(int id);
}

public class LeaderRepository : ILeaderRepository
{
    private readonly AppDbContext _context;
    public LeaderRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<Leader>> GetAllAsync() => await _context.Leaders.ToListAsync();

    public async Task<Leader?> GetByIdAsync(int id) => await _context.Leaders.FindAsync(id);

    public async Task<Leader> CreateAsync(Leader leader)
    {
        _context.Leaders.Add(leader);
        await _context.SaveChangesAsync();
        return leader;
    }

    public async Task UpdateAsync(Leader leader)
    {
        _context.Entry(leader).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var leader = await _context.Leaders.FindAsync(id);
        if (leader != null)
        {
            _context.Leaders.Remove(leader);
            await _context.SaveChangesAsync();
        }
    }
}