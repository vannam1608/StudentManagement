using StudentManagementAPI.DTOs.Common;
using StudentManagementAPI.DTOs.Notification;
using StudentManagementAPI.Models.Common;

namespace StudentManagementAPI.Interfaces.Services
{
    public interface INotificationService
    {
        /// <summary>📄 Phân trang tất cả thông báo (Admin)</summary>
        Task<PaginatedResult<NotificationDto>> GetPagedAsync(PaginationQueryDto query);

        /// <summary>📄 Phân trang thông báo theo vai trò (Student, Teacher...)</summary>
        Task<PaginatedResult<NotificationDto>> GetPagedByRoleAsync(string role, PaginationQueryDto query);

        /// <summary>🔍 Lấy 1 thông báo cụ thể</summary>
        Task<NotificationDto?> GetByIdAsync(int id);

        /// <summary>➕ Tạo mới thông báo</summary>
        Task<bool> CreateAsync(CreateNotificationDto dto, int userId);
    }
}
