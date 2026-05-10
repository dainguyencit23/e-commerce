using Azure.Core;
using E_commerce.DTOs.Image;
using E_commerce.Helpers;
using E_commerce.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace E_commerce.Controllers
{
    [ApiController]
    [Route("api")]
    public class ProductImageController : ControllerBase
    {
        private readonly IProductImageService _productImageService;
        public ProductImageController(IProductImageService productImageService)
        {
            _productImageService = productImageService;
        }
        // POST api/products/{id}/images
        [HttpPost("products/{id}/images")]
        [Authorize(Roles = "Admin, Staff")]
        public async Task<IActionResult> AddImage(Guid id, AddImageRequest request)
        {
            try
            {
                _productImageService.AddImageAsync(id, request);
                return Ok(BaseResponse<string>.Ok(string.Empty, "Add URL image successfully."));
            }catch (KeyNotFoundException ex)
            {
                return NotFound(BaseResponse<string>.Fail(ex.Message, 404));
            }
        }

        // DELETE api/images/{id}
        [HttpDelete("images/{id}")]
        [Authorize(Roles = "Admin, Staff")]
        public async Task<IActionResult> DeleteImage(Guid id)
        {
            try
            {
                _productImageService.DeleteImageAsync(id);
                return Ok(BaseResponse<string>.Ok(string.Empty, "Delete URL image successfully."));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(BaseResponse<string>.Fail(ex.Message, 404));
            }
        }
    }
}
