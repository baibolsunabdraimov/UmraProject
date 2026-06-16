namespace UmrahTourApi.Models;

public class Meeting
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Location { get; set; } = string.Empty;
    public int GroupId { get; set; }

    // Navigation property
    public virtual UmrahGroup? Group { get; set; }
}