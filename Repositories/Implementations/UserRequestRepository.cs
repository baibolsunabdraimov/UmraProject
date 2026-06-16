using Microsoft.EntityFrameworkCore;
using UmrahTourApi.Data;
using UmrahTourApi.Models;
using UmrahTourApi.Repositories.Interfaces;

namespace UmrahTourApi.Repositories.Implementations;

public class UserRequestRepository : Repository<UserRequest>, IUserRequestRepository
{
    public UserRequestRepository(AppDbContext context) : base(context) { }

    public async Task UpdateStatusAsync(int id, RequestStatus status)
    {
        var request = await _dbSet.FindAsync(id);
        if (request != null)
        {
            request.Status = status;
            await _context.SaveChangesAsync();
        }
    }
}