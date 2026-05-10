using E_commerce.DTOs.Login;

namespace E_commerce.Services.Interfaces
{
    public interface ILoginService
    {
        Task<ServiceResponse<LoginResponse>> LoginAsync(LoginRequestDTO loginRequestDTO);
    }
}
