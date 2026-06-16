using UmrahTourApi.Models;

namespace UmrahTourApi.Services.Interfaces;

public interface IUmrahGroupService
{
    Task<IEnumerable<UmrahGroup>> GetAllGroupsAsync();
    Task<UmrahGroup?> GetGroupByIdAsync(int id);
    Task<UmrahGroup?> GetGroupWithDetailsAsync(int id);
    Task<UmrahGroup> CreateGroupAsync(UmrahGroup group);
    Task UpdateGroupAsync(UmrahGroup group);
    Task DeleteGroupAsync(int id);
    Task<bool> AddPilgrimToGroupAsync(int groupId, int pilgrimId);
    Task<int> GetAvailableSeatsAsync(int groupId);
}