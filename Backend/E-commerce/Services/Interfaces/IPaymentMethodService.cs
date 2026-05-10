using E_commerce.DTOs.PaymentMethod;

namespace E_commerce.Services.Interfaces
{
    public interface IPaymentMethodService
    {
        Task<List<PaymentMethodResponse>> GetAllAsync();

        Task CreateAsync(CreatePaymentMethodRequest request);

        Task UpdateAsync(
            Guid id,
            UpdatePaymentMethodRequest request
        );
    }
}