namespace UmrahTourApi.Models;

public enum RequestStatus
{
    Pending = 0,  // Ожидание (на фронте тоже 0)
    Approved = 1, // Одобрено (на фронте тоже 1)
    Rejected = 2  // Отклонено (на фронте тоже 2)
}

public class UserRequest
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;

    // Добавляем эти поля, чтобы создать паломника позже
    public string PassportNumber { get; set; } = string.Empty;
    public int GroupId { get; set; }

    public string? Message { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public RequestStatus Status { get; set; } = RequestStatus.Pending;

    // Ссылка на группу для красоты в коде
    public UmrahGroup? Group { get; set; }
}