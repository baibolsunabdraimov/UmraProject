using UmrahTourApi.Models;

namespace UmrahTourApi.Repositories.Interfaces;

public interface IUmrahGroupRepository : IRepository<UmrahGroup>
{
    Task<UmrahGroup?> GetByIdWithDetailsAsync(int id);
    Task<IEnumerable<UmrahGroup>> GetActiveGroupsAsync();
    Task<int> GetPilgrimCountAsync(int groupId);
}