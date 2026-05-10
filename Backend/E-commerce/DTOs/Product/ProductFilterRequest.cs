using System.ComponentModel.DataAnnotations;

namespace E_commerce.DTOs.Products
{
    public class ProductFilterRequest
    {
        // lọc, tìm kiếm, phân trang sản phẩm khi get/api/products

        // search theo tên sản phẩm
        public string? Keyword { get; set; }

        // filter theo category, brand
        public Guid? CategoryId { get; set; }
        public Guid? BrandId { get; set; }

        // filter theo giá
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }

        // chia dữ liệu thành từng trang nhỏ thay vì lấy all cùng lúc
        [Range(1, int.MaxValue)]
        public int Page { get; set; } = 1;
        [Range(1, 100, ErrorMessage = "The maximum page size is 100")]
        public int PageSize { get; set; } = 10;

    }

}
