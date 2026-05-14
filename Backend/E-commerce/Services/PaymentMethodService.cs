using E_commerce.Data;
using E_commerce.DTOs.PaymentMethod;
using E_commerce.Models;
using E_commerce.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace E_commerce.Services
{
    public class PaymentMethodService : IPaymentMethodService
    {
        private readonly AppDbContext _context;

        public PaymentMethodService(AppDbContext context)
        {
            _context = context;
        }

        // Lấy danh sách payment methods
        public async Task<List<PaymentMethodResponse>> GetAllAsync()
        {
            var paymentMethods = await _context.PaymentMethods
                .Select(pm => new PaymentMethodResponse
                {
                    Id = pm.Id,
                    Name = pm.Name,
                    Description = pm.Description,
                    IsActive = pm.IsActive
                })
                .ToListAsync();

            return paymentMethods;
        }

        // Tạo payment method mới
        public async Task CreateAsync(CreatePaymentMethodRequest request)
        {
            var paymentMethod = new PaymentMethod
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                IsActive = request.IsActive
            };

            _context.PaymentMethods.Add(paymentMethod);

            await _context.SaveChangesAsync();
        }

        // Update payment method
        public async Task UpdateAsync(
            Guid id,
            UpdatePaymentMethodRequest request
        )
        {
            var paymentMethod = await _context.PaymentMethods
                .FirstOrDefaultAsync(pm => pm.Id == id);

            if (paymentMethod == null)
                throw new KeyNotFoundException("Payment method not found");

            paymentMethod.Name = request.Name;
            paymentMethod.Description = request.Description;
            paymentMethod.IsActive = request.IsActive;

            await _context.SaveChangesAsync();
        }
    }
}