namespace UmrahTourApi.Models;

public enum PaymentStatus
{
    Unpaid,
    Partial,
    Paid
}

public class Pilgrim
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string PassportNumber { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public int GroupId { get; set; }
    public int? FlightId { get; set; }
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Unpaid;

    // Navigation properties
    public virtual UmrahGroup? Group { get; set; }
    public virtual Flight? Flight { get; set; }
}