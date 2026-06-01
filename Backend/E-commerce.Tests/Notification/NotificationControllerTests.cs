using E_commerce.Controllers.NotificationController;
using E_commerce.DTOs.Notification;
using E_commerce.Helpers;
using E_commerce.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;

namespace E_commerce.Tests.Notification
{
    public class NotificationControllerTests
    {
        private readonly Mock<INotificationService> _service = new();
        private readonly Guid _userId = Guid.NewGuid();
        private readonly NotificationController _controller;

        public NotificationControllerTests()
        {
            _controller = new NotificationController(_service.Object);
            var identity = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, _userId.ToString()),
                new Claim(ClaimTypes.Role, "Customer")
            }, "TestAuth");
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(identity) }
            };
        }

        [Fact]
        public async Task GetAll_ReturnsOk_WithNotificationList()
        {
            var notifications = new List<NotificationDto>
            {
                new() { Id = Guid.NewGuid(), Title = "Đặt hàng thành công", Message = "Đơn hàng đã xác nhận", Type = "ORDER_CONFIRMED", IsRead = false, CreatedAt = DateTime.UtcNow }
            };
            _service.Setup(s => s.GetByUserAsync(_userId)).ReturnsAsync(notifications);

            var result = await _controller.GetAll();

            var ok = Assert.IsType<OkObjectResult>(result);
            var payload = Assert.IsType<BaseResponse<object>>(ok.Value);
            Assert.True(payload.Success);
        }

        [Fact]
        public async Task GetAll_ReturnsOk_WithEmptyList()
        {
            _service.Setup(s => s.GetByUserAsync(_userId)).ReturnsAsync(new List<NotificationDto>());

            var result = await _controller.GetAll();

            var ok = Assert.IsType<OkObjectResult>(result);
            var payload = Assert.IsType<BaseResponse<object>>(ok.Value);
            Assert.True(payload.Success);
        }

        [Fact]
        public async Task UnreadCount_ReturnsOk_WithCorrectCount()
        {
            _service.Setup(s => s.GetUnreadCountAsync(_userId)).ReturnsAsync(5);

            var result = await _controller.UnreadCount();

            var ok = Assert.IsType<OkObjectResult>(result);
            var payload = Assert.IsType<BaseResponse<object>>(ok.Value);
            Assert.True(payload.Success);
        }

        [Fact]
        public async Task UnreadCount_ReturnsOk_WhenCountIsZero()
        {
            _service.Setup(s => s.GetUnreadCountAsync(_userId)).ReturnsAsync(0);

            var result = await _controller.UnreadCount();

            var ok = Assert.IsType<OkObjectResult>(result);
            var payload = Assert.IsType<BaseResponse<object>>(ok.Value);
            Assert.True(payload.Success);
        }

        [Fact]
        public async Task MarkAsRead_ReturnsOk_WhenNotificationExists()
        {
            var notificationId = Guid.NewGuid();
            _service.Setup(s => s.MarkAsReadAsync(notificationId, _userId)).Returns(Task.CompletedTask);

            var result = await _controller.MarkAsRead(notificationId);

            var ok = Assert.IsType<OkObjectResult>(result);
            var payload = Assert.IsType<BaseResponse<string>>(ok.Value);
            Assert.True(payload.Success);
            _service.Verify(s => s.MarkAsReadAsync(notificationId, _userId), Times.Once);
        }

        [Fact]
        public async Task MarkAllAsRead_ReturnsOk()
        {
            _service.Setup(s => s.MarkAllAsReadAsync(_userId)).Returns(Task.CompletedTask);

            var result = await _controller.MarkAllAsRead();

            var ok = Assert.IsType<OkObjectResult>(result);
            var payload = Assert.IsType<BaseResponse<string>>(ok.Value);
            Assert.True(payload.Success);
            _service.Verify(s => s.MarkAllAsReadAsync(_userId), Times.Once);
        }
    }
}
