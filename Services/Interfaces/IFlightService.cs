using UmrahTourApi.Models;

namespace UmrahTourApi.Services.Interfaces;

public interface IFlightService
{
    Task<IEnumerable<Flight>> GetAllFlightsAsync();
    Task<Flight?> GetFlightByIdAsync(int id);
    Task<Flight?> GetFlightWithPilgrimsAsync(int id);
    Task<Flight> CreateFlightAsync(Flight flight);
    Task UpdateFlightAsync(Flight flight);
    Task DeleteFlightAsync(int id);
    Task<IEnumerable<Flight>> GetAvailableFlightsAsync();
}