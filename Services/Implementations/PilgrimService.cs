using UmrahTourApi.Models;
using UmrahTourApi.Repositories.Interfaces;
using UmrahTourApi.Services.Interfaces;

namespace UmrahTourApi.Services.Implementations;

public class PilgrimService : IPilgrimService
{
    private readonly IPilgrimRepository _pilgrimRepository;
    private readonly IFlightRepository _flightRepository;

    public PilgrimService(IPilgrimRepository pilgrimRepository, IFlightRepository flightRepository)
    {
        _pilgrimRepository = pilgrimRepository;
        _flightRepository = flightRepository;
    }

    public async Task<IEnumerable<Pilgrim>> GetAllPilgrimsAsync()
    {
        return await _pilgrimRepository.GetAllAsync();
    }

    public async Task<Pilgrim?> GetPilgrimByIdAsync(int id)
    {
        return await _pilgrimRepository.GetByIdAsync(id);
    }

    public async Task<Pilgrim?> GetPilgrimWithDetailsAsync(int id)
    {
        return await _pilgrimRepository.GetByIdWithDetailsAsync(id);
    }

    public async Task<Pilgrim> CreatePilgrimAsync(Pilgrim pilgrim)
    {
        if (pilgrim.PaymentStatus == 0)
            pilgrim.PaymentStatus = PaymentStatus.Unpaid;
        
        return await _pilgrimRepository.AddAsync(pilgrim);
    }

    public async Task UpdatePilgrimAsync(Pilgrim pilgrim)
    {
        await _pilgrimRepository.UpdateAsync(pilgrim);
    }

    public async Task DeletePilgrimAsync(int id)
    {
        await _pilgrimRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<Pilgrim>> GetPilgrimsByGroupAsync(int groupId)
    {
        return await _pilgrimRepository.GetByGroupIdAsync(groupId);
    }

    public async Task<bool> AssignFlightAsync(int pilgrimId, int flightId)
    {
        var pilgrim = await _pilgrimRepository.GetByIdAsync(pilgrimId);
        if (pilgrim == null) return false;

        var flight = await _flightRepository.GetByIdAsync(flightId);
        if (flight == null) return false;

        pilgrim.FlightId = flightId;
        await _pilgrimRepository.UpdateAsync(pilgrim);
        return true;
    }

    public async Task<bool> RemoveFlightAsync(int pilgrimId)
    {
        var pilgrim = await _pilgrimRepository.GetByIdAsync(pilgrimId);
        if (pilgrim == null) return false;

        pilgrim.FlightId = null;
        await _pilgrimRepository.UpdateAsync(pilgrim);
        return true;
    }
}