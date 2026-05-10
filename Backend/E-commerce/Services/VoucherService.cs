using E_commerce.Data;
using E_commerce.DTOs.Voucher;
using E_commerce.Models;
using E_commerce.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace E_commerce.Services
{
    public class VoucherService : IVoucherService
    {
        private readonly AppDbContext _context;
        public VoucherService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<ValidateVoucherResponse> Validate(ValidateVoucherRequest request)
        {
            var voucher = await _context.Vouchers.FirstOrDefaultAsync(v=>v.Code == request.Code);
            if (voucher == null) throw new KeyNotFoundException("Voucher not found");
            if (!voucher.IsActive) throw new InvalidOperationException("Voucher not available anymore.");
            if (DateTime.UtcNow < voucher.StartDate || DateTime.UtcNow > voucher.EndDate)
                throw new InvalidOperationException("Voucher has expired");
            if (voucher.UsedCount >= voucher.TotalQuantity)
                throw new InvalidOperationException("Voucher has run out");
            if (request.OrderAmount < voucher.MinOrderAmount)
               throw new InvalidOperationException($"Minimum amount for order is {voucher.MinOrderAmount}");

            decimal discount;
            if (voucher.DiscountType == DiscountType.Percentage)
            {
                discount = request.OrderAmount * voucher.DiscountValue / 100;
                if (voucher.MaxDiscountAmount > 0)
                    discount = Math.Min(discount, voucher.MaxDiscountAmount);
            }
            else 
            {
                discount = voucher.DiscountValue;
            }

            return new ValidateVoucherResponse
            {
                Code = voucher.Code,
                DiscountAmount = discount,
                FinalAmount = request.OrderAmount - discount
            };
        }
        public async Task<List<VoucherResponse>> GetAllAsync()
        {
            return await _context.Vouchers.Select(item => new VoucherResponse
                {
                    Id = item.Id,
                    Code = item.Code,
                    DiscountType = item.DiscountType,
                    DiscountValue = item.DiscountValue,
                    MinOrderAmount = item.MinOrderAmount,
                    MaxDiscountAmount = item.MaxDiscountAmount,
                    TotalQuantity = item.TotalQuantity,
                    UsedCount = item.UsedCount,
                    StartDate = item.StartDate,
                    EndDate = item.EndDate,
                    IsActive = item.IsActive
                }).ToListAsync();
    }
            
        
        public async Task<VoucherResponse> GetVoucherById(Guid id)
        {
            var voucher = await _context.Vouchers.FindAsync(id);
            if (voucher == null) throw new KeyNotFoundException("Voucher not found.");
            return new VoucherResponse
            {
                Id = voucher.Id,
                Code = voucher.Code,
                DiscountType = voucher.DiscountType,
                DiscountValue = voucher.DiscountValue,
                MinOrderAmount = voucher.MinOrderAmount,
                MaxDiscountAmount = voucher.MaxDiscountAmount,
                TotalQuantity = voucher.TotalQuantity,
                UsedCount = voucher.UsedCount,
                StartDate = voucher.StartDate,
                EndDate = voucher.EndDate,
                IsActive = voucher.IsActive
            };
        }
        public async Task<VoucherResponse> CreateVoucherAsync(CreateVoucherRequest request)
        {
            if (request == null) throw new InvalidDataException("Invalid request.");
            var newVoucher = new Voucher
            {
                Id = Guid.NewGuid(),
                Code = request.Code,
                DiscountType = request.DiscountType,
                DiscountValue = request.DiscountValue,
                MinOrderAmount = request.MinOrderAmount,
                MaxDiscountAmount = request.MaxDiscountAmount,
                TotalQuantity = request.TotalQuantity,
                UsedCount = 0,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                IsActive = true
            };
            _context.Vouchers.Add(newVoucher);
            await _context.SaveChangesAsync();
            return new VoucherResponse
            {
                Id = newVoucher.Id,
                Code = newVoucher.Code,
                DiscountType = newVoucher.DiscountType,
                DiscountValue = newVoucher.DiscountValue,
                MinOrderAmount = newVoucher.MinOrderAmount,
                MaxDiscountAmount = newVoucher.MaxDiscountAmount,
                TotalQuantity = newVoucher.TotalQuantity,
                UsedCount = 0,
                StartDate = newVoucher.StartDate,
                EndDate = newVoucher.EndDate,
                IsActive = true
            };
        }
        public async Task<VoucherResponse> UpdateVoucherAsync(Guid id, UpdateVoucherRequest request)
        {
            var voucher = await _context.Vouchers.FindAsync(id);
            if (voucher == null) throw new KeyNotFoundException("Voucher not exists.");
            if (request.Code != null) voucher.Code = request.Code;
            if (request.DiscountType.HasValue) voucher.DiscountType = request.DiscountType.Value;
            if (request.DiscountValue.HasValue) voucher.DiscountValue = request.DiscountValue.Value;
            if (request.MinOrderAmount.HasValue) voucher.MinOrderAmount = request.MinOrderAmount.Value;
            if (request.MaxDiscountAmount.HasValue) voucher.MaxDiscountAmount = request.MaxDiscountAmount.Value;
            if (request.TotalQuantity.HasValue) voucher.TotalQuantity = request.TotalQuantity.Value;
            if (request.StartDate.HasValue) voucher.StartDate = request.StartDate.Value;
            if (request.EndDate.HasValue) voucher.EndDate = request.EndDate.Value;
            if (request.IsActive.HasValue) voucher.IsActive = request.IsActive.Value;
            await _context.SaveChangesAsync();
            return new VoucherResponse
            {
                Id = voucher.Id,
                Code = voucher.Code,
                DiscountType = voucher.DiscountType,
                DiscountValue = voucher.DiscountValue,
                MinOrderAmount = voucher.MinOrderAmount,
                MaxDiscountAmount = voucher.MaxDiscountAmount,
                TotalQuantity = voucher.TotalQuantity,
                UsedCount = voucher.UsedCount,
                StartDate = voucher.StartDate,
                EndDate = voucher.EndDate,
                IsActive = voucher.IsActive
            };
        }
        public async Task DeleteAsync(Guid id)
        {
            var voucher = await _context.Vouchers.FindAsync(id);
            if (voucher == null) throw new KeyNotFoundException("Voucher not exists.");
            _context.Vouchers.Remove(voucher);
            await _context.SaveChangesAsync();
        }
    }
}
