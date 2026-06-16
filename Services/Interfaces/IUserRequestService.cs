using UmrahTourApi.Models;
namespace UmrahTourApi.Services.Interfaces;

public interface IUserRequestService
{
    Task<IEnumerable<UserRequest>> GetAllAsync();
    Task<UserRequest> CreateAsync(UserRequest request);
    Task UpdateStatusAsync(int id, RequestStatus status);
    Task DeleteAsync(int id);
}