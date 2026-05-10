using E_commerce.DTOs.Products;
using E_commerce.Helpers;

namespace E_commerce.Services.Interfaces
{
    public interface IProductService
    {
        // lấy danh sách sản phẩm
        Task<PagedResponse<ProductResponse>> GetAll(ProductFilterRequest filter);

        // lấy sản phẩm 
        Task<ProductResponse> GetById(Guid id);

        // tạo sản phẩm mới
        Task<ProductResponse> CreateProduct(CreateProductRequest request);

        // cập nhật sản phẩm
        Task<ProductResponse> UpdateProduct(Guid id, UpdateProductRequest request);

        // xóa sản phẩm 
        Task<bool> DeleteProduct(Guid id);
    }
}
