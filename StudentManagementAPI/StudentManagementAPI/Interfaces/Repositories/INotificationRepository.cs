using StudentManagementAPI.Models;

namespace StudentManagementAPI.Interfaces.Repositories
{
    public interface INotificationRepository : IBaseRepository<Notification>
    {
        Task<IEnumerable<Notification>> GetByTargetRoleAsync(string role);
        Task<IEnumerable<Notification>> GetLatestAsync(int count = 10);
        Task<IEnumerable<Notification>> GetByUserIdAsync(int userId);

        // ➕ Các method bị thiếu
        Task<IEnumerable<Notification>> GetAllByRoleAsync(string role);
        Task CreateAsync(Notification newNotification);
    }
}
