using E_commerce.DTOs.Notification;

namespace E_commerce.Services.Interfaces
{
    public interface INotificationService
    {
        Task CreateAsync(CreateNotificationRequest request);
        Task<List<NotificationDto>> GetByUserAsync(Guid userId);
        Task<int> GetUnreadCountAsync(Guid userId);
        Task MarkAsReadAsync(Guid notificationId, Guid userId);
        Task MarkAllAsReadAsync(Guid userId);
    }
}
