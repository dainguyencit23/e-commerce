using E_commerce.DTOs.Products;
using E_commerce.Helpers;
using E_commerce.Models;
using E_commerce.Repositories.Interfaces;
using E_commerce.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace E_commerce.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<PagedResponse<ProductResponse>> GetAll(ProductFilterRequest request)
        {
            var query = _productRepository
                .GetProductsQuery()
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.ProductVariants)
                .Include(p => p.ProductImages)
                .AsQueryable();

            // lọc theo tên
            if (!string.IsNullOrWhiteSpace(request.Keyword))
                query = query.Where(p => p.Name.Contains(request.Keyword));

            // lọc theo category 
            if (request.CategoryId.HasValue)
                query = query.Where(p => p.CategoryId == request.CategoryId.Value);

            // lọc theo brand
            if (request.BrandId.HasValue)
                query = query.Where(p => p.BrandId == request.BrandId.Value);

            // lọc theo giá 
            if (request.MinPrice.HasValue)
                query = query.Where(p =>
                    p.ProductVariants.Any() &&
                    p.ProductVariants.Min(v => v.Price) >= request.MinPrice.Value);

            if (request.MaxPrice.HasValue)
                query = query.Where(p =>
                    p.ProductVariants.Any() &&
                    p.ProductVariants.Min(v => v.Price) <= request.MaxPrice.Value);

            var totalItems = await query.CountAsync();

            // phân trang
            var products = await query
                .OrderBy(p => p.Name)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

           // trả về 
            var response = products.Select(p => MapToResponse(p)).ToList();

            return new PagedResponse<ProductResponse>(response, totalItems, request.Page, request.PageSize);
        }

        public async Task<ProductResponse> GetById(Guid id)
        {
            
            var product = await _productRepository
                .GetProductsQuery()
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.ProductVariants)
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                throw new KeyNotFoundException($"Product {id} not found.");

            return MapToResponse(product);
        }

        public async Task<ProductResponse> CreateProduct(CreateProductRequest request)
        {
            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                CategoryId = request.CategoryId,
                BrandId = request.BrandId,
                ProductVariants = request.Variants.Select(v => new ProductVariant
                {
                    Id = Guid.NewGuid(),
                    Name = v.Name,
                    Price = v.Price,
                    Quantity = v.Quantity
                }).ToList(),
                ProductImages = request.ImageUrls.Select(url => new ProductImage
                {
                    ProductImageId = Guid.NewGuid(),
                    ImageUrl = url
                }).ToList()
            };

            await _productRepository.AddProduct(product);
            await _productRepository.SaveChanges();

            return MapToResponse(product);
        }

        public async Task<ProductResponse> UpdateProduct(Guid id, UpdateProductRequest request)
        {

            var product = await _productRepository.GetById(id);
            if (product == null)
                throw new KeyNotFoundException($"Product {id} not found.");

            if (request.Name != null) product.Name = request.Name;
            if (request.Description != null) product.Description = request.Description;
            if (request.CategoryId.HasValue) product.CategoryId = request.CategoryId.Value;
            if (request.BrandId.HasValue) product.BrandId = request.BrandId.Value;
            if (request.AverageRating.HasValue) product.AverageRating = request.AverageRating.Value;

            if (request.Variants != null)
            {
                var toDelete = product.ProductVariants
                    .Where(v => !request.Variants.Any(r => r.Id == v.Id))
                    .ToList();
                _productRepository.RemoveVariants(toDelete);

                foreach (var variantRequest in request.Variants)
                {
                    if (variantRequest.Id.HasValue)
                    {
                        var existing = product.ProductVariants
                            .FirstOrDefault(v => v.Id == variantRequest.Id.Value);
                        if (existing != null)
                        {
                            existing.Name = variantRequest.Name;
                            existing.Price = variantRequest.Price;
                            existing.Quantity = variantRequest.Quantity;
                        }
                    }
                    else
                    {
                        product.ProductVariants.Add(new ProductVariant
                        {
                            Id = Guid.NewGuid(),
                            ProductId = id,
                            Name = variantRequest.Name,
                            Price = variantRequest.Price,
                            Quantity = variantRequest.Quantity
                        });
                    }
                }
            }

            if (request.ImageUrls != null)
            {
                _productRepository.RemoveImages(product.ProductImages.ToList());
                product.ProductImages = request.ImageUrls.Select(url => new ProductImage
                {
                    ProductImageId = Guid.NewGuid(),
                    ProductId = id,
                    ImageUrl = url
                }).ToList();
            }

            await _productRepository.SaveChanges();
            return MapToResponse(product);
        }

        public async Task<bool> DeleteProduct(Guid id)
        {
            var product = await _productRepository.GetById(id);
            if (product == null)
                throw new KeyNotFoundException($"Product {id} not found.");

            _productRepository.DeleteProduct(product);
            return await _productRepository.SaveChanges();
        }

        
        private ProductResponse MapToResponse(Product p) =>
            new ProductResponse
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                CategoryName = p.Category?.Name ?? "N/A",
                BrandName = p.Brand?.Name ?? "N/A",
                MinPrice = p.ProductVariants != null && p.ProductVariants.Any()
                    ? p.ProductVariants.Min(v => v.Price)
                    : 0,
                AverageRating = p.AverageRating,
                Variants = p.ProductVariants?.Select(v => new ProductVariantResponse
                {
                    Id = v.Id,
                    Name = v.Name,
                    Price = v.Price,
                    Quantity = v.Quantity
                }).ToList() ?? new List<ProductVariantResponse>(),
                ImageUrls = p.ProductImages?.Select(img => img.ImageUrl).ToList()
                            ?? new List<string>()
            };
    }
}
