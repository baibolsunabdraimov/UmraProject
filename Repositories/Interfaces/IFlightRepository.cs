using UmrahTourApi.Models;

namespace UmrahTourApi.Repositories.Interfaces;

public interface IFlightRepository : IRepository<Flight>
{
    Task<Flight?> GetByIdWithPilgrimsAsync(int id);
    Task<IEnumerable<Flight>> GetAvailableFlightsAsync();
}