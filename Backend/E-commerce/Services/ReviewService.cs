using E_commerce.Data;
using E_commerce.DTOs.Review;
using E_commerce.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace E_commerce.Services
{
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _context;

        public ReviewService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ReviewResponse>> GetProductReviews(Guid productId)
        {
            return await _context.Reviews
                .Where(r => r.ProductId == productId)
                .Select(r => new ReviewResponse
                {
                    Id = r.Id,
                    UserName = r.User.FullName,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedDate = r.CreatedDate
                })
                .ToListAsync();
        }
    }
}