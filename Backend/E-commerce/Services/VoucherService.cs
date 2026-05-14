using E_commerce.Data;
using E_commerce.DTOs.Voucher;
using E_commerce.Models;
using E_commerce.Repositories.Interfaces;
using E_commerce.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace E_commerce.Services
{
    public class VoucherService : IVoucherService
    {
        private readonly IVoucherRepository _repo;
        public VoucherService(IVoucherRepository voucherRepo)
        {
            _repo = voucherRepo;
        }
        public async Task<ValidateVoucherResponse> Validate(ValidateVoucherRequest request)
        {
            var voucher = await _repo.GetByCode(request.Code);
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
            var vouchers = await _repo.GetAll();
            return vouchers.Select(MapToResponse).ToList();
        }
            
        
        public async Task<VoucherResponse> GetVoucherById(Guid id)
        {
            var voucher = await _repo.GetById(id);
            if (voucher == null) throw new KeyNotFoundException("Voucher not found.");
            return MapToResponse(voucher); 
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
            await _repo.Add(newVoucher);
            await _repo.SaveChanges();
            return MapToResponse(newVoucher);
        }
        public async Task<VoucherResponse> UpdateVoucherAsync(Guid id, UpdateVoucherRequest request)
        {
            var voucher = await _repo.GetById(id);
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
            await _repo.SaveChanges();
            return MapToResponse(voucher);
        }
        public async Task DeleteAsync(Guid id)
        {
            var voucher = await _repo.GetById(id);
            if (voucher == null) throw new KeyNotFoundException("Voucher not exists.");
            _repo.Remove(voucher);
            await _repo.SaveChanges();
        }
        private VoucherResponse MapToResponse(Voucher v) => new VoucherResponse
        {
            Id = v.Id,
            Code = v.Code,
            DiscountType = v.DiscountType,
            DiscountValue = v.DiscountValue,
            MinOrderAmount = v.MinOrderAmount,
            MaxDiscountAmount = v.MaxDiscountAmount,
            TotalQuantity = v.TotalQuantity,
            UsedCount = v.UsedCount,
            StartDate = v.StartDate,
            EndDate = v.EndDate,
            IsActive = v.IsActive
        };
    }
}
