using UmrahTourApi.Models;

namespace UmrahTourApi.Repositories.Interfaces;

public interface IPilgrimRepository : IRepository<Pilgrim>
{
    Task<Pilgrim?> GetByIdWithDetailsAsync(int id);
    Task<IEnumerable<Pilgrim>> GetByGroupIdAsync(int groupId);
    Task<Pilgrim?> GetByPassportAsync(string passportNumber);
    Task<bool> HasFlightAsync(int pilgrimId);
}