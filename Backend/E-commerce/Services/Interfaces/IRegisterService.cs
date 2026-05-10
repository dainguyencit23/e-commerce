using E_commerce.DTOs.Auth;

namespace E_commerce.Services.Interfaces
{
    public interface IRegisterService
    {
        Task<ServiceResponse<UserInfoResponse>> RegisterAsync(RegisterRequest requestDTO);
    }
}
