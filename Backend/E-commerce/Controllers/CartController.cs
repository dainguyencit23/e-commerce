using E_commerce.DTOs.Cart;
using E_commerce.Services.Interfaces;

// ================= BEFORE =================
// using Microsoft.AspNetCore.Authorization;
// using System.Security.Claims;
// ==========================================

using Microsoft.AspNetCore.Mvc;

namespace E_commerce.Controllers
{
    // ================= BEFORE =================
    // [Authorize]
    // ==========================================

    // ================= CURRENT =================
    // TEMP: Disable Authorize because Login API is not working yet
    // TODO: Restore [Authorize] after JWT/Auth is fixed
    // ===========================================

    [ApiController]
    [Route("api/cart")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        // ================= CURRENT =================
        // TEMP TEST USER ID FROM DATABASE
        // admin account from seed data
        private readonly Guid _testUserId =
            Guid.Parse("03000001-0000-0000-0000-000000000000");
        // ===========================================

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        // GET /api/cart
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            // ================= BEFORE =================
            // var userId = Guid.Parse(
            //     User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            // );
            // ==========================================

            // ================= CURRENT =================
            var userId = _testUserId;
            // ===========================================

            var cart = await _cartService.GetCartAsync(userId);

            if (cart == null)
                return NotFound();

            return Ok(cart);
        }

        // POST /api/cart/items
        [HttpPost("items")]
        public async Task<IActionResult> AddItem(AddCartItemDto dto)
        {
            // ================= BEFORE =================
            // var userId = Guid.Parse(
            //     User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            // );
            // ==========================================

            // ================= CURRENT =================
            var userId = _testUserId;
            // ===========================================

            var result = await _cartService.AddItemAsync(userId, dto);

            if (!result)
                return BadRequest("Cannot add item");

            return Ok();
        }

        // PUT /api/cart/items/{id}
        [HttpPut("items/{id}")]
        public async Task<IActionResult> UpdateItem(
            Guid id,
            UpdateCartItemDto dto)
        {
            var result = await _cartService.UpdateItemAsync(id, dto);

            if (!result)
                return BadRequest();

            return Ok();
        }

        // DELETE /api/cart/items/{id}
        [HttpDelete("items/{id}")]
        public async Task<IActionResult> DeleteItem(Guid id)
        {
            var result = await _cartService.DeleteItemAsync(id);

            if (!result)
                return NotFound();

            return NoContent();
        }

        // DELETE /api/cart
        [HttpDelete]
        public async Task<IActionResult> ClearCart()
        {
            // ================= BEFORE =================
            // var userId = Guid.Parse(
            //     User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            // );
            // ==========================================

            // ================= CURRENT =================
            var userId = _testUserId;
            // ===========================================

            var result = await _cartService.ClearCartAsync(userId);

            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}