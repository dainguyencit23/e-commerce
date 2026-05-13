using E_commerce.Models;

namespace E_commerce.Repositories.Interfaces
{
    public interface IReviewRepository
    {
        Task<Product?> GetProductById(Guid productId);

        Task<Review?> GetReviewById(Guid reviewId);

        Task AddReview(Review review);

        void DeleteReview(Review review);

        Task<double> CalculateAverageRating(Guid productId);

        Task SaveChanges();
    }
}