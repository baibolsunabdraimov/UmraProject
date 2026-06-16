namespace UmrahTourApi.Models;

public class Flight
{
    public int Id { get; set; }
    public string Airline { get; set; } = string.Empty;
    public string FlightNumber { get; set; } = string.Empty;
    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }
    public decimal TicketPrice { get; set; }

    // Navigation properties
    public virtual ICollection<Pilgrim> Pilgrims { get; set; } = new List<Pilgrim>();
}