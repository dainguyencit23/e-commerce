using E_commerce.DTOs.Order;
using E_commerce.Helpers;
using E_commerce.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace E_commerce.Controllers
{
    [ApiController]
    [Route("api/orders")]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // POST api/orders
        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CreateOrder(CreateOrderRequest request)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try
            {
                var order = await _orderService.CreateOrder(userId, request);
                return Ok(BaseResponse<OrderResponse>.Ok(order, "Order placed successfully."));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(BaseResponse<string>.Fail(ex.Message, 404));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(BaseResponse<string>.Fail(ex.Message, 400));
            }
        }


        [HttpGet]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var orders = await _orderService.GetAllOrders();
                return Ok(BaseResponse<List<OrderResponse>>.Ok(orders));
            }
            catch (Exception ex)
            {
                return StatusCode(500, BaseResponse<string>.Fail(ex.Message, 500));
            }
        }

        // GET api/orders/my 
        [HttpGet("my")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetMyOrders([FromQuery] OrderFilterRequest filter)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var orders = await _orderService.GetMyOrders(userId, filter);
                return Ok(BaseResponse<List<OrderResponse>>.Ok(orders));
            }
            catch (Exception ex)
            {
                return StatusCode(500, BaseResponse<string>.Fail(ex.Message, 500));
            }
        }

        // GET api/orders/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var order = await _orderService.GetOrderById(id);
                return Ok(BaseResponse<OrderResponse>.Ok(order));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(BaseResponse<string>.Fail(ex.Message, 404));
            }
        }
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> UpdateStatus(Guid id, UpdateOrderStatusRequest request)
        {
            try
            {
                var order = await _orderService.UpdateStatus(id, request);
                return Ok(BaseResponse<OrderResponse>.Ok(order, "Status updated."));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(BaseResponse<string>.Fail(ex.Message, 404));
            }
            catch (Exception ex)
            {
                return StatusCode(500, BaseResponse<string>.Fail(ex.Message, 500));
            }
        }

        [HttpPut("{id}/cancel")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CancelOrder(Guid id)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try
            {
                await _orderService.CancelOrder(id, userId);
                return Ok(BaseResponse<string>.Ok(string.Empty, "Order cancelled successfully."));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(BaseResponse<string>.Fail(ex.Message, 404));
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, BaseResponse<string>.Fail(ex.Message, 403));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(BaseResponse<string>.Fail(ex.Message, 400));
            }
        }

        
    }
}
