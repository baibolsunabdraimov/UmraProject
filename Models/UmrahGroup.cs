namespace UmrahTourApi.Models;

public enum GroupStatus
{
    Draft,
    Recruiting,
    Full,
    Completed
}

public class UmrahGroup
{
    public int? LeaderId { get; set; } // ID лидера
    public Leader? Leader { get; set; }
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime DepartureDate { get; set; }
    public DateTime ReturnDate { get; set; }
    public GroupStatus Status { get; set; } = GroupStatus.Draft;
    public int MaxSeats { get; set; }

    // Navigation properties
    public virtual ICollection<Pilgrim> Pilgrims { get; set; } = new List<Pilgrim>();
    public virtual ICollection<Meeting> Meetings { get; set; } = new List<Meeting>();
}