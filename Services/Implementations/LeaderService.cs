using UmrahTourApi.Models;
using UmrahTourApi.Repositories.Interfaces;
using UmrahTourApi.Services.Interfaces;

public class LeaderService : ILeaderService
{
    private readonly ILeaderRepository _repo;
    public LeaderService(ILeaderRepository repo) => _repo = repo;

    public Task<IEnumerable<Leader>> GetAllAsync() => _repo.GetAllAsync();
    public Task<Leader?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);
    public async Task<Leader> CreateAsync(Leader leader) => await _repo.AddAsync(leader); // Вызываем AddAsync!
    public Task UpdateAsync(Leader leader) => _repo.UpdateAsync(leader);
    public Task DeleteAsync(int id) => _repo.DeleteAsync(id);
}