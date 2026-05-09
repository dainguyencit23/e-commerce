using E_commerce.DTOs.Cart;
using E_commerce.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace E_commerce.Controllers
{
    // [Authorize]
    // TEMP: Disable Authorize because Login API is not working yet
    // TODO: Restore [Authorize] after JWT/Auth is fixed

    [ApiController]
    [Route("api/cart")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        // TEMP TEST USER ID
        // Replace after JWT login works
        private readonly Guid _testUserId =
            Guid.Parse("03000001-0000-0000-0000-000000000000");

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        // GET: /api/cart
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = _testUserId;

            var cart = await _cartService.GetCartAsync(userId);

            if (cart == null)
                return NotFound("Cart not found");

            return Ok(cart);
        }

        // POST: /api/cart/items
        [HttpPost("items")]
        public async Task<IActionResult> AddItem(AddCartItem dto)
        {
            var userId = _testUserId;

            var result = await _cartService.AddItemAsync(userId, dto);

            if (!result)
                return BadRequest("Cannot add item");

            return Ok("Add item successfully");
        }

        // PUT: /api/cart/items/{id}
        [HttpPut("items/{id}")]
        public async Task<IActionResult> UpdateItem(
            Guid id,
            UpdateCartItem dto
        )
        {
            var result = await _cartService.UpdateItemAsync(id, dto);

            if (!result)
                return BadRequest("Cannot update item");

            return Ok("Update item successfully");
        }

        // DELETE: /api/cart/items/{id}
        [HttpDelete("items/{id}")]
        public async Task<IActionResult> DeleteItem(Guid id)
        {
            var result = await _cartService.DeleteItemAsync(id);

            if (!result)
                return NotFound("Cart item not found");

            return NoContent();
        }

        // DELETE: /api/cart
        [HttpDelete]
        public async Task<IActionResult> ClearCart()
        {
            var userId = _testUserId;

            var result = await _cartService.ClearCartAsync(userId);

            if (!result)
                return NotFound("Cart not found");

            return NoContent();
        }
    }
}