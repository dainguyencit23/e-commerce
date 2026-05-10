using E_commerce.DTOs.Review;

namespace E_commerce.Services.Interfaces
{
    public interface IReviewService
    {
        Task<List<ReviewResponse>> GetProductReviews(Guid productId);
    }
}