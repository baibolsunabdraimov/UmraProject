using UmrahTourApi.Models;
using UmrahTourApi.Repositories.Interfaces;
using UmrahTourApi.Services.Interfaces;

namespace UmrahTourApi.Services.Implementations;

public class UserRequestService : IUserRequestService
{
    private readonly IUserRequestRepository _repository;
    public UserRequestService(IUserRequestRepository repository) => _repository = repository;

    public Task<IEnumerable<UserRequest>> GetAllAsync() => _repository.GetAllAsync();
    public Task<UserRequest> CreateAsync(UserRequest request) => _repository.AddAsync(request);

    public Task UpdateStatusAsync(int id, RequestStatus status) => _repository.UpdateStatusAsync(id, status);

    public Task DeleteAsync(int id) => _repository.DeleteAsync(id);
}