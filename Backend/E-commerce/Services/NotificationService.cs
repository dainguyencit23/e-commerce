using E_commerce.DTOs.Notification;
using E_commerce.Models;
using E_commerce.Repositories.Interfaces;
using E_commerce.Services.Interfaces;

namespace E_commerce.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _repo;
        public NotificationService(INotificationRepository repo) => _repo = repo;

        public async Task CreateAsync(CreateNotificationRequest request)
        {
            var notification = new Notification
            {
                UserId = request.UserId,
                Title = request.Title,
                Message = request.Message,
                Type = request.Type
            };
            await _repo.AddAsync(notification);
            await _repo.SaveChangesAsync();
        }

        public async Task<List<NotificationDto>> GetByUserAsync(Guid userId)
        {
            var list = await _repo.GetByUserIdAsync(userId);
            return list.Select(n => new NotificationDto
            {
                Id = n.Id,
                Title = n.Title,
                Message = n.Message,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt,
                Type = n.Type
            }).ToList();
        }

        public async Task<int> GetUnreadCountAsync(Guid userId)
            => await _repo.GetUnreadCountAsync(userId);

        public async Task MarkAsReadAsync(Guid notificationId, Guid userId)
        {
            var n = await _repo.GetByIdAsync(notificationId);
            if (n == null || n.UserId != userId) return;
            n.IsRead = true;
            await _repo.SaveChangesAsync();
        }

        public async Task MarkAllAsReadAsync(Guid userId)
        {
            var list = await _repo.GetByUserIdAsync(userId);
            list.ForEach(n => n.IsRead = true);
            await _repo.SaveChangesAsync();
        }
    }
}
