using E_commerce.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace E_commerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // GET /api/admin/customers
        [HttpGet("customers")]
        public async Task<IActionResult> GetCustomers()
        {
            var customers = await _adminService.GetUsersByRoleAsync("Customer");
            return Ok(customers);
        }

        // GET /api/admin/staff
        [HttpGet("staff")]
        public async Task<IActionResult> GetStaff()
        {
            var staff = await _adminService.GetUsersByRoleAsync("Staff");
            return Ok(staff);
        }
    }
}