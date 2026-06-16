namespace UmrahTourApi.Models;

public enum RequestStatus { New, Contacted, Converted, Cancelled }

public class UserRequest
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Message { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public RequestStatus Status { get; set; } = RequestStatus.New;
}