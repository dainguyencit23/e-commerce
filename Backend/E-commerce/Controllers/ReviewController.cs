using Microsoft.AspNetCore.Mvc;
using E_commerce.Data;
using E_commerce.DTOs.Review;

namespace E_commerce.Controllers
{
    [ApiController]
    [Route("api")]
    public class ReviewController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET: /api/products/{id}/reviews
        [HttpGet("products/{id}/reviews")]
        public IActionResult GetReviewsByProduct(Guid id)
        {
            var reviews = _context.Reviews
                .Where(r => r.ProductId == id)
                .Select(r => new ReviewResponse
                {
                    Id = r.Id,
                    UserName = r.User.FullName,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedDate = r.CreatedDate
                })
                .ToList();

            return Ok(reviews);
        }
    }
}