using UmrahTourApi.Models;

namespace UmrahTourApi.Services.Interfaces;

public interface IPilgrimService
{
    Task<IEnumerable<Pilgrim>> GetAllPilgrimsAsync();
    Task<Pilgrim?> GetPilgrimByIdAsync(int id);
    Task<Pilgrim?> GetPilgrimWithDetailsAsync(int id);
    Task<Pilgrim> CreatePilgrimAsync(Pilgrim pilgrim);
    Task UpdatePilgrimAsync(Pilgrim pilgrim);
    Task DeletePilgrimAsync(int id);
    Task<IEnumerable<Pilgrim>> GetPilgrimsByGroupAsync(int groupId);
    Task<bool> AssignFlightAsync(int pilgrimId, int flightId);
    Task<bool> RemoveFlightAsync(int pilgrimId);
}