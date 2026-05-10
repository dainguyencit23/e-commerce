using E_commerce.Models;

namespace E_commerce.Repositories.Interfaces
{
    public interface IProductVariantRepository
    {
        Task<ProductVariant?> GetById(Guid id);
        Task<List<ProductVariant>> GetByProductId(Guid productId);
        Task Add(ProductVariant variant);
        void Remove(ProductVariant variant);
        Task<bool> SaveChanges();
    }
}
