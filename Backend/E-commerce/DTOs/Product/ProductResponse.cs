using E_commerce.Models;

namespace E_commerce.DTOs.Products
{
    public class ProductResponse
    {
        // frontend show những gì
        public Guid Id { get; set; }

        public string Name { get; set; } = null!; // tên (từ product)
        public string? Description { get; set; } // miêu tả (từ product)

        public string CategoryName { get; set; } = null!; // từ category 
        public string BrandName { get; set; } = null!; // từ brand

        // tính điểm trung bình rating 
        public double AverageRating { get; set; }

        // hiển thị giá thấp nhất của sản phẩm 
        public decimal MinPrice { get; set; }

        public List<ProductVariantResponse> Variants { get; set; } = new();
        public List<string> ImageUrls { get; set; } = new();
    }

    public class ProductVariantResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
