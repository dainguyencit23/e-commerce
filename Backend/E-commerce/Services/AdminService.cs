using E_commerce.Data;
using E_commerce.DTOs.Admin;
using E_commerce.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace E_commerce.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;

        public AdminService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserListResponseDto>> GetUsersByRoleAsync(string roleName)
        {
            return await _context.Users
                .Include(u => u.Role)
                .Where(u => u.Role.Name == roleName)
                .Select(u => new UserListResponseDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    RoleName = u.Role.Name
                })
                .ToListAsync();
        }
    }
}