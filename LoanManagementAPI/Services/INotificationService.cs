using LoanManagementAPI.DTOs;

namespace LoanManagementAPI.Services
{
    public interface INotificationService
    {
        Task CreateAsync(
            string? userId,
            string? role,
            string title,
            string message
        );

        Task<List<NotificationDto>> GetMyNotificationsAsync(
            string userId,
            string role
        );

        Task MarkAsReadAsync(int notificationId);
    }

}
