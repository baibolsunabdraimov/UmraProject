using UmrahTourApi.Models;
using UmrahTourApi.Repositories.Interfaces;
using UmrahTourApi.Services.Interfaces;

namespace UmrahTourApi.Services.Implementations;

public class FlightService : IFlightService
{
    private readonly IFlightRepository _flightRepository;

    public FlightService(IFlightRepository flightRepository)
    {
        _flightRepository = flightRepository;
    }

    public async Task<IEnumerable<Flight>> GetAllFlightsAsync()
    {
        return await _flightRepository.GetAllAsync();
    }

    public async Task<Flight?> GetFlightByIdAsync(int id)
    {
        return await _flightRepository.GetByIdAsync(id);
    }

    public async Task<Flight?> GetFlightWithPilgrimsAsync(int id)
    {
        return await _flightRepository.GetByIdWithPilgrimsAsync(id);
    }

    public async Task<Flight> CreateFlightAsync(Flight flight)
    {
        return await _flightRepository.AddAsync(flight);
    }

    public async Task UpdateFlightAsync(Flight flight)
    {
        await _flightRepository.UpdateAsync(flight);
    }

    public async Task DeleteFlightAsync(int id)
    {
        await _flightRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<Flight>> GetAvailableFlightsAsync()
    {
        return await _flightRepository.GetAvailableFlightsAsync();
    }
}