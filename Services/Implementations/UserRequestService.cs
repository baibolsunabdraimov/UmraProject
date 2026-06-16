using UmrahTourApi.Models;
using UmrahTourApi.Repositories.Interfaces;
using UmrahTourApi.Services.Interfaces;
using UmrahTourApi.Data;

namespace UmrahTourApi.Services.Implementations;

public class UserRequestService : IUserRequestService
{
    private readonly IUserRequestRepository _repository;
    private readonly AppDbContext _context;

    public UserRequestService(IUserRequestRepository repository, AppDbContext context)
    {
        _repository = repository;
        _context = context;
    }

    public Task<IEnumerable<UserRequest>> GetAllAsync() => _repository.GetAllAsync();

    // ИСПРАВЛЕНО: Теперь вызываем AddAsync (метод из базового репозитория)
    public Task<UserRequest> CreateAsync(UserRequest request) => _repository.AddAsync(request);

    public Task UpdateStatusAsync(int id, RequestStatus status) => _repository.UpdateStatusAsync(id, status);

    public Task DeleteAsync(int id) => _repository.DeleteAsync(id);

    public async Task<bool> ApproveRequestAsync(int id)
    {
        var request = await _context.UserRequests.FindAsync(id);
        if (request == null) return false;

        var pilgrim = new Pilgrim
        {
            FullName = request.FullName,
            PassportNumber = request.PassportNumber,
            PhoneNumber = request.PhoneNumber,
            GroupId = request.GroupId,
            PaymentStatus = PaymentStatus.Unpaid
        };

        _context.Pilgrims.Add(pilgrim);
        request.Status = RequestStatus.Approved;

        await _context.SaveChangesAsync();
        return true;
    }
}