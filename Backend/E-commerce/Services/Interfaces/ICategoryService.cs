using E_commerce.DTOs.Category;

namespace E_commerce.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<List<CategoryResponse>> GetCategories();

        Task<CategoryResponse> CreateCategory(CategoryRequest request);

        Task<CategoryResponse> UpdateCategory(Guid id, CategoryRequest request);

        Task DeleteCategory(Guid id);
    }
}