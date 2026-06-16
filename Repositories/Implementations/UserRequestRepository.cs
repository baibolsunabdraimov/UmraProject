using Microsoft.EntityFrameworkCore;
using UmrahTourApi.Data;
using UmrahTourApi.Models;
using UmrahTourApi.Repositories.Interfaces;

namespace UmrahTourApi.Repositories.Implementations;

public class UserRequestRepository : Repository<UserRequest>, IUserRequestRepository
{
    public UserRequestRepository(AppDbContext context) : base(context) { }

    // Переопределяем метод получения всех заявок, чтобы добавить данные о группе
    public override async Task<IEnumerable<UserRequest>> GetAllAsync()
    {
        return await _dbSet
            .Include(r => r.Group) // <--- ГЛАВНАЯ СТРОКА: загружает данные из таблицы UmrahGroups
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

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