using E_commerce.DTOs.SupportRequest;
using E_commerce.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace E_commerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupportController : ControllerBase
    {
        private readonly ISupportService _supportService;

        public SupportController(ISupportService supportService)
        {
            _supportService = supportService;
        }

        // POST /api/support — Customer
        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CreateTicket([FromBody] CreateSupportRequestDto dto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out Guid userId))
                return Unauthorized();

            var result = await _supportService.CreateTicketAsync(userId, dto);
            return Ok(result);
        }

        // GET /api/support — Customer
        [HttpGet]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetMyTickets()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out Guid userId))
                return Unauthorized();

            var results = await _supportService.GetTicketsByUserIdAsync(userId);
            return Ok(results);
        }

        // GET /api/support/all — Staff, Admin
        [HttpGet("all")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> GetAllTickets([FromQuery] string? status)
        {
            var results = await _supportService.GetAllTicketsAsync(status);
            return Ok(results);
        }
    }
}