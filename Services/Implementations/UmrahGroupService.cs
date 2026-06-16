using UmrahTourApi.Models;
using UmrahTourApi.Repositories.Interfaces;
using UmrahTourApi.Services.Interfaces;

namespace UmrahTourApi.Services.Implementations;

public class UmrahGroupService : IUmrahGroupService
{
    private readonly IUmrahGroupRepository _groupRepository;
    private readonly IPilgrimRepository _pilgrimRepository;

    public UmrahGroupService(IUmrahGroupRepository groupRepository, IPilgrimRepository pilgrimRepository)
    {
        _groupRepository = groupRepository;
        _pilgrimRepository = pilgrimRepository;
    }

    public async Task<IEnumerable<UmrahGroup>> GetAllGroupsAsync()
    {
        return await _groupRepository.GetAllAsync();
    }

    public async Task<UmrahGroup?> GetGroupByIdAsync(int id)
    {
        return await _groupRepository.GetByIdAsync(id);
    }

    public async Task<UmrahGroup?> GetGroupWithDetailsAsync(int id)
    {
        return await _groupRepository.GetByIdWithDetailsAsync(id);
    }

    public async Task<UmrahGroup> CreateGroupAsync(UmrahGroup group)
    {
        if (group.Status == 0)
            group.Status = GroupStatus.Draft;
        
        return await _groupRepository.AddAsync(group);
    }

    public async Task UpdateGroupAsync(UmrahGroup group)
    {
        await _groupRepository.UpdateAsync(group);
    }

    public async Task DeleteGroupAsync(int id)
    {
        await _groupRepository.DeleteAsync(id);
    }

    public async Task<bool> AddPilgrimToGroupAsync(int groupId, int pilgrimId)
    {
        var group = await _groupRepository.GetByIdAsync(groupId);
        if (group == null) return false;

        var pilgrim = await _pilgrimRepository.GetByIdAsync(pilgrimId);
        if (pilgrim == null) return false;

        var currentCount = await _groupRepository.GetPilgrimCountAsync(groupId);
        if (currentCount >= group.MaxSeats)
            return false;

        pilgrim.GroupId = groupId;
        await _pilgrimRepository.UpdateAsync(pilgrim);

        // Update group status
        if (currentCount + 1 >= group.MaxSeats)
        {
            group.Status = GroupStatus.Full;
        }
        else if (group.Status == GroupStatus.Draft)
        {
            group.Status = GroupStatus.Recruiting;
        }
        await _groupRepository.UpdateAsync(group);

        return true;
    }

    public async Task<int> GetAvailableSeatsAsync(int groupId)
    {
        var group = await _groupRepository.GetByIdAsync(groupId);
        if (group == null) return 0;

        var currentCount = await _groupRepository.GetPilgrimCountAsync(groupId);
        return Math.Max(0, group.MaxSeats - currentCount);
    }
}