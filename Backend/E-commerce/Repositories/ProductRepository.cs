using E_commerce.Data;
using E_commerce.Models;
using E_commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace E_commerce.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;
        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }
        public IQueryable<Product> GetProductsQuery()
        {
            return _context.Products.AsNoTracking();
        } // Chỉ đọc nội dung ( đọc đúng lần đầu tiên kh tiếp tục đọc sau đó )

        public async Task<Product?> GetById(Guid id)
        {
            return await _context.Products
                .Include(p => p.ProductVariants)
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
        public async Task AddProduct(Product product)
        {
            await _context.Products.AddAsync(product);
        }

        // tìm đối tượng theo Id và đánh dấu là thay đổi
        public void UpdateProduct(Product product)
        {
            _context.Products.Update(product);
        }

        public void DeleteProduct(Product product)
        {
            _context.Remove(product);
        }

        public void RemoveVariants(List<ProductVariant> variants)
        {
            _context.ProductVariants.RemoveRange(variants);
        }

        public void RemoveImages(List<ProductImage> images)
        {
            _context.ProductImages.RemoveRange(images);
        }

        public async Task<bool> SaveChanges()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
