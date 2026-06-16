using Microsoft.EntityFrameworkCore;
using UmrahTourApi.Data;
using UmrahTourApi.Repositories.Implementations;
using UmrahTourApi.Repositories.Interfaces;
using UmrahTourApi.Services.Implementations;
using UmrahTourApi.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container

// Database - SQLite for local development (change to SQL Server for production)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Data Source=umrah_tour.db"));

// Repositories
builder.Services.AddScoped<IUmrahGroupRepository, UmrahGroupRepository>();
builder.Services.AddScoped<IPilgrimRepository, PilgrimRepository>();
builder.Services.AddScoped<IFlightRepository, FlightRepository>();
builder.Services.AddScoped<IMeetingRepository, MeetingRepository>();


builder.Services.AddScoped<ILeaderRepository, LeaderRepository>();
builder.Services.AddScoped<ILeaderService, LeaderService>();

// Services
builder.Services.AddScoped<IUmrahGroupService, UmrahGroupService>();
builder.Services.AddScoped<IPilgrimService, PilgrimService>();
builder.Services.AddScoped<IFlightService, FlightService>();
builder.Services.AddScoped<IMeetingService, MeetingService>();
builder.Services.AddScoped<IStatsService, StatsService>();

// Controllers
builder.Services.AddControllers();

// Swagger configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Umrah Tour API",
        Version = "v1",
        Description = "API для системы организации туров Умра",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Umrah Tour Team"
        }
    });

    // Include XML comments if available
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

// CORS for frontend integration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Umrah Tour API v1");
        c.RoutePrefix = string.Empty; // Swagger at root
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

// Auto-migrate database on startup (development only)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.Run();