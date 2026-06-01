using E_commerce.DTOs.Order;
using E_commerce.DTOs.Payments;
using E_commerce.Helpers;
using E_commerce.Models;
using E_commerce.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace E_commerce.Controllers
{
    [ApiController]
    [Route("api/payment")]
    public class PaymentController : ControllerBase
    {
        private readonly IVNPayService _vnpay;
        private readonly IOrderService _orderService;

        public PaymentController(IVNPayService vnpay, IOrderService orderService)
        {
            _vnpay = vnpay;
            _orderService = orderService;
        }

        // Tạo URL thanh toán
        [HttpPost("vnpay/create")]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreatePaymentRequest request)
        {
            var order = await _orderService.GetOrderById(request.OrderId);
            if (order == null) return NotFound();

            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
            var url = _vnpay.CreatePaymentUrl(
                order.Id,
                order.TotalAmount,
                $"Thanh toan don hang {order.Id}",
                ipAddress
            );

            return Ok(BaseResponse<string>.Ok(url));
        }

        // IPN — VNPay gọi vào để xác nhận (không cần auth)
        [HttpGet("vnpay/ipn")]
        public async Task<IActionResult> Ipn()
        {
            var isValid = _vnpay.ValidateCallback(Request.Query, out var status);

            if (!isValid)
                return Ok(new { RspCode = "97", Message = "Invalid signature" });

            var orderId = Guid.Parse(Request.Query["vnp_TxnRef"]!);
            var newStatus = status == "00" ? OrderStatus.Processing : OrderStatus.Cancelled;
            await _orderService.UpdateStatus(orderId, new UpdateOrderStatusRequest { OrderStatus = newStatus });

            return Ok(new { RspCode = "00", Message = "Confirm success" });
        }
    }

}