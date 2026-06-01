using E_commerce.Models;

namespace E_commerce.Repositories.Interfaces
{
    public interface INotificationRepository
    {
        Task AddAsync(Notification notification);
        Task<List<Notification>> GetByUserIdAsync(Guid userId);
        Task<Notification?> GetByIdAsync(Guid id);
        Task<int> GetUnreadCountAsync(Guid userId);
        Task SaveChangesAsync();
    }
}
