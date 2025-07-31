using StudentManagementAPI.DTOs.Notification;

namespace StudentManagementAPI.Interfaces.Services
{
    public interface INotificationService
    {
        Task<IEnumerable<NotificationDto>> GetAllAsync(string role);
        Task<NotificationDto?> GetByIdAsync(int id);
        Task<bool> CreateAsync(CreateNotificationDto dto, int userId);
    }
}
