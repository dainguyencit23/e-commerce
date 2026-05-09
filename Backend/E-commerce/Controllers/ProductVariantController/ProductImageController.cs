// using E_commerce.DTOs.Image;
// using Microsoft.AspNetCore.Mvc;

// namespace E_commerce.Controllers.ProductImageController
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class ProductImageController : ControllerBase
//     {
//         // POST api/products/{id}/images
//         [HttpPost("products/{id}/images")]
//         public async Task<IActionResult> AddImage(Guid id, AddImageRequest request)
//         {
//             // 1. Tìm product, NotFound nếu không có
//             // 2. Tạo ProductImage với ProductId = id, ImageUrl = request.ImageUrl
//             // 3. SaveChangesAsync, return Ok
//         }

//         // DELETE api/images/{id}
//         [HttpDelete("images/{id}")]
//         public async Task<IActionResult> DeleteImage(Guid id)
//         {
//             // ⚠️ PK của ProductImage là ProductImageId (không phải Id)
//             // Dùng: _context.ProductImages.FirstOrDefaultAsync(i => i.ProductImageId == id)
//         }
//     }
// }
