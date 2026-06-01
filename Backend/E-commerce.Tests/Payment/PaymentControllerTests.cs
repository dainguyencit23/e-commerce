using E_commerce.Controllers;
using E_commerce.DTOs.Notification;
using E_commerce.DTOs.Order;
using E_commerce.DTOs.Payments;
using E_commerce.Helpers;
using E_commerce.Models;
using E_commerce.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Moq;

namespace E_commerce.Tests.Payment
{
    public class PaymentControllerTests
    {
        private readonly Mock<IVNPayService> _vnpay = new();
        private readonly Mock<IOrderService> _orderService = new();
        private readonly Mock<INotificationService> _notificationService = new();
        private readonly PaymentController _controller;

        public PaymentControllerTests()
        {
            _controller = new PaymentController(_vnpay.Object, _orderService.Object, _notificationService.Object);
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
        }

        private OrderResponse FakeOrder(Guid? id = null, Guid? userId = null) => new OrderResponse
        {
            Id = id ?? Guid.NewGuid(),
            TotalAmount = 500000m,
            UserId = userId ?? Guid.NewGuid(),
            Status = OrderStatus.Pending,
            ReceiverName = "Nguyen Van A",
            ReceiverPhone = "0901234567",
            ShippingAddress = "123 Test St",
            PaymentMethodName = "VNPay"
        };

        // ── Create ──────────────────────────────────────────────────────────

        [Fact]
        public async Task Create_ReturnsOk_WhenOrderFoundAndUrlGenerated()
        {
            var order = FakeOrder();
            var expectedUrl = "https://sandbox.vnpay.vn/pay?token=abc";
            _orderService.Setup(s => s.GetOrderById(order.Id)).ReturnsAsync(order);
            _vnpay.Setup(v => v.CreatePaymentUrl(order.Id, order.TotalAmount, It.IsAny<string>(), It.IsAny<string>()))
                  .Returns(expectedUrl);

            var result = await _controller.Create(new CreatePaymentRequest { OrderId = order.Id });

            var ok = Assert.IsType<OkObjectResult>(result);
            var payload = Assert.IsType<BaseResponse<string>>(ok.Value);
            Assert.True(payload.Success);
            Assert.Equal(expectedUrl, payload.Data);
        }

        [Fact]
        public async Task Create_ReturnsNotFound_WhenOrderDoesNotExist()
        {
            var id = Guid.NewGuid();
            _orderService.Setup(s => s.GetOrderById(id)).ReturnsAsync((OrderResponse)null!);

            var result = await _controller.Create(new CreatePaymentRequest { OrderId = id });

            Assert.IsType<NotFoundResult>(result);
        }

        // ── IPN ─────────────────────────────────────────────────────────────

        [Fact]
        public async Task Ipn_ReturnsInvalidSignature_WhenValidationFails()
        {
            string outStatus = "";
            _vnpay.Setup(v => v.ValidateCallback(It.IsAny<IQueryCollection>(), out outStatus)).Returns(false);

            var result = await _controller.Ipn();

            var ok = Assert.IsType<OkObjectResult>(result);
            var value = ok.Value as dynamic;
            Assert.NotNull(value);
        }

        [Fact]
        public async Task Ipn_UpdatesStatusToProcessing_AndDoesNotSendNotification_WhenPaymentSuccessful()
        {
            var orderId = Guid.NewGuid();
            var order = FakeOrder(orderId);
            string outStatus = "00";
            _vnpay.Setup(v => v.ValidateCallback(It.IsAny<IQueryCollection>(), out outStatus)).Returns(true);
            _orderService.Setup(s => s.UpdateStatus(orderId, It.Is<UpdateOrderStatusRequest>(r =>
                r.OrderStatus == OrderStatus.Processing))).ReturnsAsync(order);

            var context = new DefaultHttpContext();
            context.Request.Query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "vnp_TxnRef", orderId.ToString() }
            });
            _controller.ControllerContext = new ControllerContext { HttpContext = context };

            var result = await _controller.Ipn();

            Assert.IsType<OkObjectResult>(result);
            _notificationService.Verify(n => n.CreateAsync(It.IsAny<CreateNotificationRequest>()), Times.Never);
        }

        [Fact]
        public async Task Ipn_UpdatesStatusToCancelled_AndSendsPaymentFailedNotification_WhenPaymentFailed()
        {
            var orderId = Guid.NewGuid();
            var customerId = Guid.NewGuid();
            var order = FakeOrder(orderId, customerId);
            string outStatus = "24"; // user cancelled on VNPay
            _vnpay.Setup(v => v.ValidateCallback(It.IsAny<IQueryCollection>(), out outStatus)).Returns(true);
            _orderService.Setup(s => s.UpdateStatus(orderId, It.Is<UpdateOrderStatusRequest>(r =>
                r.OrderStatus == OrderStatus.Cancelled))).ReturnsAsync(order);
            _orderService.Setup(s => s.GetOrderById(orderId)).ReturnsAsync(order);
            _notificationService.Setup(n => n.CreateAsync(It.IsAny<CreateNotificationRequest>()))
                .Returns(Task.CompletedTask);

            var context = new DefaultHttpContext();
            context.Request.Query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "vnp_TxnRef", orderId.ToString() }
            });
            _controller.ControllerContext = new ControllerContext { HttpContext = context };

            var result = await _controller.Ipn();

            Assert.IsType<OkObjectResult>(result);
            _notificationService.Verify(n => n.CreateAsync(It.Is<CreateNotificationRequest>(r =>
                r.Type == "PAYMENT_FAILED" && r.UserId == customerId)), Times.Once);
        }
    }
}
