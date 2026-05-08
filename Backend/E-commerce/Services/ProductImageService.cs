using E_commerce.Data;
using E_commerce.DTOs.Image;
using E_commerce.Models;
using E_commerce.Services.Interfaces;

namespace E_commerce.Services
{
    public class ProductImageService: IProductImageService
    {
        private readonly AppDbContext _context;
        public ProductImageService(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddImageAsync(Guid productId, AddImageRequest request)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) throw new KeyNotFoundException("Product not found");
            var newImg = new ProductImage
            {
                ProductImageId = Guid.NewGuid(),
                ProductId = productId,
                ImageUrl = request.Url
            };
            _context.ProductImages.Add(newImg);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteImageAsync(Guid imageId)
        {
            var productImg = await _context.ProductImages.FirstOrDefaultAsync(i => i.ProductImageId == imageId);
            if (productImg == null) throw new KeyNotFoundException("Product Image not found");
            _context.ProductImages.Remove(productImg);
            await _context.SaveChangesAsync();
        }
    }
}