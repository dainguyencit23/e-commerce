using E_commerce.DTOs.Image;
using E_commerce.Helpers;
using E_commerce.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace E_commerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductImageController : ControllerBase
    {
        private readonly IProductImageService _productImageService;
        public ProductImageController(IProductImageService productImageService)
        {
            _productImageService = productImageService;
        }

        [HttpPost]
        public async Task<IActionResult> AddImage(Guid id, AddImageRequest request)
        {
            try
            {
                await _productImageService.AddImageAsync(id, request);
                return Ok(BaseResponse<string>.Ok(string.Empty, "Add image successfully."));
            }catch (KeyNotFoundException ex)
            {
                return NotFound(BaseResponse<string>.Fail(ex.Message, 404));
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImage(Guid id)
        {
            try
            {
                await _productImageService.DeleteImageAsync(id);
                return Ok(BaseResponse<string>.Ok(string.Empty, "Delete image successfully."));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(BaseResponse<string>.Fail(ex.Message, 404));
            }
        }
    }
}