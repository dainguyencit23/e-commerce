using E_commerce.DTOs.Variant;

namespace E_commerce.Services.Interfaces
{
    public interface IProductVariantService
    {
        Task<VariantResponse> AddVariant(Guid id, CreateVariantRequest request);
        Task<VariantResponse> UpdateVariant(Guid id, UpdateVariantRequest request);
        Task DeleteVariant(Guid id);
        Task<List<VariantResponse>> GetVariantsByProductId(Guid productId);
    }
}
