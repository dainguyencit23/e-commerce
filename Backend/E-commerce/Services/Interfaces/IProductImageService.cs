using E_commerce.DTOs.Image;

namespace E_commerce.Services.Interfaces
{
    public interface IProductImageService
    {
        Task AddImageAsync(Guid productId, AddImageRequest request);
        Task DeleteImageAsync(Guid imageId);
    }
}
