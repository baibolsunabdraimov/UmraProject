using UmrahTourApi.Models;

namespace UmrahTourApi.Repositories.Interfaces;

public interface IUserRequestRepository : IRepository<UserRequest>
{
    Task UpdateStatusAsync(int id, RequestStatus status);
}