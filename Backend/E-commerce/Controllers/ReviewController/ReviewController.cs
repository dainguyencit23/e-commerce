using E_commerce.DTOs.Review;
using E_commerce.Helpers;
using E_commerce.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace E_commerce.Controllers.ReviewController
{
    [ApiController]
    [Route("api/products")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet("{id}/reviews")]
        public async Task<IActionResult> GetReviews(Guid id)
        {
            var result = await _reviewService.GetProductReviews(id);

            return Ok(BaseResponse<List<ReviewResponse>>.Ok(result));
        }
    }
}