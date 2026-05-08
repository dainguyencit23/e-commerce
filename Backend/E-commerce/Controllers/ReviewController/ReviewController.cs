using E_commerce.Data;
using E_commerce.DTOs.Review;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_commerce.Controllers.ReviewController
{
    [Route("api")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/products/{id}/reviews
        [HttpGet("products/{id}/reviews")]
        public async Task<IActionResult> GetProductReviews(Guid id)
        {
            var reviews = await _context.Reviews
                .Where(r => r.ProductId == id)
                .Select(r => new ReviewResponse
                {
                    Id = r.Id,
                    UserName = r.User.FullName,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedDate = r.CreatedDate
                })
                .ToListAsync();

            return Ok(reviews);
        }
    }
}