using E_commerce.DTOs.Brand;

namespace E_commerce.Services.Interfaces
{
    public interface IBrandService
    {
        Task<List<BrandResponse>> GetBrands();

        Task<BrandResponse> CreateBrand(BrandRequest request);

        Task<BrandResponse> UpdateBrand(Guid id, BrandRequest request);

        Task DeleteBrand(Guid id);
    }
}