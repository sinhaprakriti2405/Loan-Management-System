using LoanManagementAPI.Data;
using LoanManagementAPI.DTOs;
using LoanManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LoanManagementAPI.Services
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;

        public NotificationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(
            string? userId,
            string? role,
            string title,
            string message
        )
        {
            _context.Notifications.Add(new Notification
            {
                UserId = userId,
                Role = role,
                Title = title,
                Message = message,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
        }

        public async Task<List<NotificationDto>> GetMyNotificationsAsync(
            string userId,
            string role
        )
        {
            return await _context.Notifications
                .Where(n =>
                    n.UserId == userId ||
                    (n.Role == role && n.UserId == null)
                )
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new NotificationDto
                {
                    Id = n.Id,
                    Title = n.Title,
                    Message = n.Message,
                    IsRead = n.IsRead,
                    CreatedAt = n.CreatedAt
                })
                .ToListAsync();
        }

        public async Task MarkAsReadAsync(int notificationId)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification == null) return;

            notification.IsRead = true;
            await _context.SaveChangesAsync();
        }
    }


}
