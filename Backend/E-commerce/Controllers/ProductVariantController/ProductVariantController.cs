using E_commerce.DTOs.Variant;
using E_commerce.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace E_commerce.Controllers.ProductVariantController
{
    [ApiController]
    [Route("api")]
    public class ProductVariantController : ControllerBase
    {
        private readonly IProductVariantService _variantService;
        public ProductVariantController(IProductVariantService variantService)
        {
            _variantService = variantService;
        }

        // POST api/products/{id}/variants
        [HttpPost("products/{id}/variants")]
        public async Task<IActionResult> AddVariant(Guid id, CreateVariantRequest request)
        {
            var res = await _variantService.AddVariant(id, request);
            return Ok(res);
        }

        // PUT api/variants/{id}
        [HttpPut("variants/{id}")]
        public async Task<IActionResult> UpdateVariant(Guid id, UpdateVariantRequest request)
        {
            var res = await _variantService.UpdateVariant(id, request);
            return Ok(res);
        }

        // DELETE api/variants/{id}
        [HttpDelete("variants/{id}")]
        public async Task<IActionResult> DeleteVariant(Guid id)
        {
            await _variantService.DeleteVariant(id);
            return Ok(new { message = "Deleted successfully." });
        }
    }
}