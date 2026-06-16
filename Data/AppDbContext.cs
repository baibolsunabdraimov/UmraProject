using Microsoft.EntityFrameworkCore;
using UmrahTourApi.Models;

namespace UmrahTourApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<UmrahGroup> UmrahGroups => Set<UmrahGroup>();
    public DbSet<Pilgrim> Pilgrims => Set<Pilgrim>();
    public DbSet<Flight> Flights => Set<Flight>();
    public DbSet<Meeting> Meetings => Set<Meeting>();
    public DbSet<UserRequest> UserRequests => Set<UserRequest>();
    public DbSet<Leader> Leaders => Set<Leader>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1. UmrahGroup configuration
        modelBuilder.Entity<UmrahGroup>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.MaxSeats).IsRequired();
        });

        modelBuilder.Entity<UmrahGroup>()
            .HasOne(g => g.Leader)
            .WithMany(l => l.Groups)
            .HasForeignKey(g => g.LeaderId)
            .OnDelete(DeleteBehavior.SetNull);

        // 2. Pilgrim configuration
        modelBuilder.Entity<Pilgrim>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.PassportNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);

            entity.HasOne(p => p.Group)
                  .WithMany(g => g.Pilgrims)
                  .HasForeignKey(p => p.GroupId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(p => p.Flight)
                  .WithMany(f => f.Pilgrims)
                  .HasForeignKey(p => p.FlightId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // 3. UserRequest configuration (ДОБАВЬ ЭТОТ БЛОК)
        modelBuilder.Entity<UserRequest>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.PassportNumber).IsRequired().HasMaxLength(50);

            // Настройка связи заявки с группой
            entity.HasOne(r => r.Group)
                  .WithMany() // Группе не обязательно иметь список заявок внутри себя
                  .HasForeignKey(r => r.GroupId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // 4. Flight configuration
        modelBuilder.Entity<Flight>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Airline).IsRequired().HasMaxLength(100);
            entity.Property(e => e.FlightNumber).IsRequired().HasMaxLength(20);
            entity.Property(e => e.TicketPrice).HasPrecision(18, 2);
        });

        // 5. Meeting configuration
        modelBuilder.Entity<Meeting>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Location).HasMaxLength(300);

            entity.HasOne(m => m.Group)
                  .WithMany(g => g.Meetings)
                  .HasForeignKey(m => m.GroupId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // 6. Indexes
        modelBuilder.Entity<Pilgrim>().HasIndex(p => p.PassportNumber).IsUnique();
        modelBuilder.Entity<Flight>().HasIndex(f => f.FlightNumber);
    }
}