using E_commerce.DTOs.Admin;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace E_commerce.Services.Interfaces
{
    public interface IAdminService
    {
        Task<IEnumerable<UserListResponseDto>> GetUsersByRoleAsync(string roleName);
    }
}