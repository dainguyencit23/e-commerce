using E_commerce.Data;
using E_commerce.Models;
using E_commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace E_commerce.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly AppDbContext _context;
        public NotificationRepository(AppDbContext context) => _context = context;

        public async Task AddAsync(Notification notification)
            => await _context.Notifications.AddAsync(notification);

        public async Task<List<Notification>> GetByUserIdAsync(Guid userId)
            => await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

        public async Task<Notification?> GetByIdAsync(Guid id)
            => await _context.Notifications.FindAsync(id);

        public async Task<int> GetUnreadCountAsync(Guid userId)
            => await _context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead);

        public async Task SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}
