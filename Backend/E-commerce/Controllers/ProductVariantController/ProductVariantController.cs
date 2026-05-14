using E_commerce.DTOs.Variant;
using E_commerce.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using E_commerce.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace E_commerce.Controllers
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

        [HttpGet("products/{id}/variants")]
        public async Task<IActionResult> GetVariants(Guid id)
        {
            try
            {
                var res = await _variantService.GetVariantsByProductId(id);
                return Ok(BaseResponse<List<VariantResponse>>.Ok(res));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(BaseResponse<string>.Fail(ex.Message, 404));
            }
        }

        [HttpPost("products/{id}/variants")]
        [Authorize(Roles ="Admin,Staff")]
        public async Task<IActionResult> AddVariant(Guid id, CreateVariantRequest request)
        {
            try
            {
                var res = await _variantService.AddVariant(id, request);
                return Ok(BaseResponse<VariantResponse>.Ok(res));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(BaseResponse<string>.Fail(ex.Message, 404));
            }
        }

        [HttpPut("variants/{id}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> UpdateVariant(Guid id, UpdateVariantRequest request)
        {
            try
            {
                var res = await _variantService.UpdateVariant(id, request);
                return Ok(BaseResponse<VariantResponse>.Ok(res));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(BaseResponse<string>.Fail(ex.Message, 404));
            }
        }

        [HttpDelete("variants/{id}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> DeleteVariant(Guid id)
        {
            try
            {
                await _variantService.DeleteVariant(id);
                return Ok(BaseResponse<string>.Ok(string.Empty, "Deleted successfully"));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(BaseResponse<string>.Fail(ex.Message, 404));
            }

        }
    }
}