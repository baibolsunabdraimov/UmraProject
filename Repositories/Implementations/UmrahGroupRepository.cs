using Microsoft.EntityFrameworkCore;
using UmrahTourApi.Data;
using UmrahTourApi.Models;
using UmrahTourApi.Repositories.Interfaces;

namespace UmrahTourApi.Repositories.Implementations;

public class UmrahGroupRepository : Repository<UmrahGroup>, IUmrahGroupRepository
{
    public UmrahGroupRepository(AppDbContext context) : base(context) { }

    public override async Task<IEnumerable<UmrahGroup>> GetAllAsync()
    {
        return await _dbSet
            .Include(g => g.Pilgrims)
            .Include(g => g.Leader)
            .ToListAsync();
    }

    public async Task<UmrahGroup?> GetByIdWithDetailsAsync(int id)
    {
        return await _dbSet
            .Include(g => g.Pilgrims)
            .Include(g => g.Leader)  
            .Include(g => g.Meetings)
            .FirstOrDefaultAsync(g => g.Id == id);
    }

    public async Task<IEnumerable<UmrahGroup>> GetActiveGroupsAsync()
    {
        return await _dbSet
            .Include(g => g.Pilgrims)
            .Include(g => g.Leader)
            .Where(g => g.Status != GroupStatus.Completed)
            .ToListAsync();
    }

    public async Task<int> GetPilgrimCountAsync(int groupId)
    {
        
        return await _context.Pilgrims.CountAsync(p => p.GroupId == groupId);
    }
}