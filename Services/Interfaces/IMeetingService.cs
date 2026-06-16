using UmrahTourApi.Models;

namespace UmrahTourApi.Services.Interfaces;

public interface IMeetingService
{
    Task<IEnumerable<Meeting>> GetAllMeetingsAsync();
    Task<Meeting?> GetMeetingByIdAsync(int id);
    Task<Meeting> CreateMeetingAsync(Meeting meeting);
    Task UpdateMeetingAsync(Meeting meeting);
    Task DeleteMeetingAsync(int id);
    Task<IEnumerable<Meeting>> GetMeetingsByGroupAsync(int groupId);
}