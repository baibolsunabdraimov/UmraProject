namespace UmrahTourApi.Services.Implementations;

using UmrahTourApi.Models;
using UmrahTourApi.Repositories.Implementations;

public interface ILeaderService : ILeaderRepository { }

public class LeaderService : ILeaderService
{
    private readonly ILeaderRepository _repo;
    public LeaderService(ILeaderRepository repo) => _repo = repo;

    public Task<IEnumerable<Leader>> GetAllAsync() => _repo.GetAllAsync();
    public Task<Leader?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);
    public Task<Leader> CreateAsync(Leader leader) => _repo.CreateAsync(leader);
    public Task UpdateAsync(Leader leader) => _repo.UpdateAsync(leader);
    public Task DeleteAsync(int id) => _repo.DeleteAsync(id);
}