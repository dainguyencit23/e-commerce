using E_commerce.Data;
using E_commerce.DTOs.Login;
using E_commerce.Services.Interfaces;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;

namespace E_commerce.Services
{
    public class LoginService : ILoginService
    {
        private readonly AppDbContext _context;
        private readonly ITokenService _tokenService;

        public LoginService(AppDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }   

        public async Task<ServiceResponse<LoginResponse>> LoginAsync(LoginRequestDTO dto)
        {
            var response = new ServiceResponse<LoginResponse>();

            var user = await _context.Users.Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.Trim().ToLower());

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            {
                response.IsSuccess = false;
                response.Message = "Email or password wrong!";
                return response;
            }

            response.Data = new LoginResponse
            {
                Email = user.Email,
                RoleName = user.Role?.Name ?? "Customer",
                Token = _tokenService.CreateToken(user)
            };
            response.IsSuccess = true;
            response.Message = "Login successful.";
            return response;
        }
    }
}
