using E_commerce.Models;

namespace E_commerce.Services.Interfaces
{
    public interface ITokenService
    {
        public string CreateToken(User user);
    }
}
