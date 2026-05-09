using E_commerce.DTOs.Voucher;

namespace E_commerce.Services.Interfaces
{
    public interface IVoucherService
    {
        Task<ValidateVoucherResponse> Validate(ValidateVoucherRequest request);
        Task<List<VoucherResponse>> GetAllAsync();
        Task<VoucherResponse> GetVoucherById(Guid id);
        Task<VoucherResponse> CreateVoucherAsync(CreateVoucherRequest request);
        Task<VoucherResponse> UpdateVoucherAsync(Guid id, UpdateVoucherRequest request);
        Task DeleteAsync(Guid id);
    }
}
