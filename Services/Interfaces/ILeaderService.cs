using UmrahTourApi.Models;
namespace UmrahTourApi.Services.Interfaces;

public interface ILeaderService
{
    Task<IEnumerable<Leader>> GetAllAsync();
    Task<Leader?> GetByIdAsync(int id);
    Task<Leader> CreateAsync(Leader leader);
    Task UpdateAsync(Leader leader);
    Task DeleteAsync(int id);
}