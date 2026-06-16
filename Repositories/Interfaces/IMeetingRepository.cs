using UmrahTourApi.Models;

namespace UmrahTourApi.Repositories.Interfaces;

public interface IMeetingRepository : IRepository<Meeting>
{
    Task<IEnumerable<Meeting>> GetByGroupIdAsync(int groupId);
}