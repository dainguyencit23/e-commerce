using E_commerce.Data;
using E_commerce.DTOs.Auth;
using E_commerce.Models;
using E_commerce.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace E_commerce.Services
{
    public class RegisterService : IRegisterService
    {
        private readonly AppDbContext _context;

        public RegisterService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResponse<UserInfoResponse>> RegisterAsync(RegisterRequest dto)
        {
            var response = new ServiceResponse<UserInfoResponse>();

            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                response.IsSuccess = false;
                response.Message = "Email is exist.";
                return response;
            }
            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };
            var role = await _context.Roles.FirstAsync(r => r.Name == "Customer");

            user.RoleId = role.Id;

            _context.Users.Add(user);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                response.IsSuccess = false;
                response.Message = ex.InnerException?.Message ?? ex.Message;
                return response;
            }
            response.IsSuccess = true;
            response.Message = "Registration successful";
            response.Data = new UserInfoResponse
            {
                Email = dto.Email,
                Name = dto.Name
            };
            return response;
        }
    }
}
