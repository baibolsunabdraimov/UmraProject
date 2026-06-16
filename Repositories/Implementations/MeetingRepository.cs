using Microsoft.EntityFrameworkCore;
using UmrahTourApi.Data;
using UmrahTourApi.Models;
using UmrahTourApi.Repositories.Interfaces;

namespace UmrahTourApi.Repositories.Implementations;

public class MeetingRepository : Repository<Meeting>, IMeetingRepository
{
    public MeetingRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Meeting>> GetByGroupIdAsync(int groupId)
    {
        return await _dbSet
            .Where(m => m.GroupId == groupId)
            .OrderBy(m => m.Date)
            .ToListAsync();
    }
}