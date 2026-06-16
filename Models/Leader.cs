namespace UmrahTourApi.Models;

public class Leader
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty; // ФИО Ажы башчы
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Experience { get; set; } // Опыт (например, "10 лет")

    // Связь: Один лидер может вести много групп
    public ICollection<UmrahGroup> Groups { get; set; } = new List<UmrahGroup>();
}