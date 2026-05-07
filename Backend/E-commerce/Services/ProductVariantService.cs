using E_commerce.Data;
using E_commerce.DTOs.Variant;
using E_commerce.Models; 
using E_commerce.Services.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace E_commerce.Services
{
    public class ProductVariantService: IProductVariantService
    {
        private readonly AppDbContext _context;
        public ProductVariantService(AppDbContext context) 
        {
            _context = context;
        }
        public async Task<VariantResponse> AddVariant(Guid ProductId, CreateVariantRequest request)
        {
            // 1. Tìm product theo id, NotFound nếu không có
            var product = await _context.Products.FindAsync(ProductId);
            if (product == null) throw new KeyNotFoundException("Product not found.");

            // 2. Tạo ProductVariant mới với ProductId = id
            var variant = new ProductVariant
            {
                Id = Guid.NewGuid(),
                ProductId = ProductId,
                Name = request.Name,
                Price = request.Price,
                Quantity = request.Quatity
            };
            // 3. SaveChangesAsync
            _context.ProductVariants.Add(variant);
            await _context.SaveChangesAsync();

            // 4. Return Ok(VariantResponse)
            return new VariantResponse
            {
                Id = variant.Id,
                Name = variant.Name,
                Price = variant.Price,
                Quatity = variant.Quantity
            };
        }
        public async Task<VariantResponse> UpdateVariant(Guid VariantId, UpdateVariantRequest request)
        {
            // 1. Tìm variant theo id, NotFound nếu không có
            var variant = await _context.ProductVariants.FindAsync(VariantId);
            if (variant == null) throw new KeyNotFoundException("Variant not found.");

            // 2. Cập nhật từng field nếu request không null
            if (request.Name != null) variant.Name = request.Name;
            if (request.Price.HasValue) variant.Price = request.Price.Value;
            if (request.Quantity.HasValue) variant.Quantity = request.Quantity.Value;

            // 3. SaveChangesAsync
            await _context.SaveChangesAsync();

            // 4. Return Ok(VariantResponse)
            return new VariantResponse
            {
                Id = variant.Id,
                Name = variant.Name,
                Price = variant.Price,
                Quatity = variant.Quantity
            };
        }
        public async Task DeleteVariant(Guid VariantId)
        {
            // 1. Tìm variant theo id, NotFound nếu không có
            var variant = await _context.ProductVariants.FindAsync(VariantId);
            if (variant == null) throw new KeyNotFoundException("Variant not found.");

            // 2. Remove + SaveChangesAsync
            _context.ProductVariants.Remove(variant);
            await _context.SaveChangesAsync();
        }
    }

}