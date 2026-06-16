using UmrahTourApi.Models;
using UmrahTourApi.Repositories.Interfaces;
using UmrahTourApi.Services.Interfaces;

namespace UmrahTourApi.Services.Implementations;

public class MeetingService : IMeetingService
{
    private readonly IMeetingRepository _meetingRepository;

    public MeetingService(IMeetingRepository meetingRepository)
    {
        _meetingRepository = meetingRepository;
    }

    public async Task<IEnumerable<Meeting>> GetAllMeetingsAsync()
    {
        return await _meetingRepository.GetAllAsync();
    }

    public async Task<Meeting?> GetMeetingByIdAsync(int id)
    {
        return await _meetingRepository.GetByIdAsync(id);
    }

    public async Task<Meeting> CreateMeetingAsync(Meeting meeting)
    {
        return await _meetingRepository.AddAsync(meeting);
    }

    public async Task UpdateMeetingAsync(Meeting meeting)
    {
        await _meetingRepository.UpdateAsync(meeting);
    }

    public async Task DeleteMeetingAsync(int id)
    {
        await _meetingRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<Meeting>> GetMeetingsByGroupAsync(int groupId)
    {
        return await _meetingRepository.GetByGroupIdAsync(groupId);
    }
}