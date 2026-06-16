using UmrahTourApi.Data;
using UmrahTourApi.Models;
using UmrahTourApi.Repositories.Interfaces;

namespace UmrahTourApi.Repositories.Implementations;

public class LeaderRepository : Repository<Leader>, ILeaderRepository
{
    public LeaderRepository(AppDbContext context) : base(context) { }
}