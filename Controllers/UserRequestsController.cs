using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UmrahTourApi.Data;
using UmrahTourApi.Models;

namespace UmrahTourApi.Controllers;

[ApiController]
[Route("api/[controller]")] 
public class UserRequestsController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserRequestsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserRequest>>> GetRequests()
    {
        return await _context.UserRequests.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<UserRequest>> CreateRequest(UserRequest request)
    {
        _context.UserRequests.Add(request);
        await _context.SaveChangesAsync();
        return Ok(request);
    }
}