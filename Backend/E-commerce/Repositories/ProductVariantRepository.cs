using E_commerce.Data;
using E_commerce.Models;
using E_commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace E_commerce.Repositories
{
    public class ProductVariantRepository: IProductVariantRepository
    {
        private readonly AppDbContext _context;
        public ProductVariantRepository (AppDbContext context)
        {
            _context = context;
        }
        public async Task<ProductVariant?> GetById(Guid id)
            => await _context.ProductVariants.FindAsync(id);

        public async Task<List<ProductVariant>> GetByProductId(Guid productId)
            => await _context.ProductVariants
                .Where(v => v.ProductId == productId)
                .ToListAsync();

        public async Task Add(ProductVariant variant)
            => await _context.ProductVariants.AddAsync(variant);

        public void Remove(ProductVariant variant)
            => _context.ProductVariants.Remove(variant);

        public async Task<bool> SaveChanges()
            => await _context.SaveChangesAsync() > 0;
    }
}
