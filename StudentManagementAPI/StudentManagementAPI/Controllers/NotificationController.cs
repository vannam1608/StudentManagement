using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.DTOs.Common;
using StudentManagementAPI.DTOs.Notification;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Models.Common;
using System.Security.Claims;

namespace StudentManagementAPI.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    [Authorize]
    [Tags("Quản lý Thông báo")]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        /// <summary>📬 Lấy danh sách thông báo có phân trang theo role (Admin/Student/Teacher)</summary>
        [HttpGet]
        [Authorize(Policy = "notification:view")]
        public async Task<IActionResult> GetPagedNotifications([FromQuery] PaginationQueryDto query)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(role))
                return Unauthorized("Không xác định được vai trò.");

            PaginatedResult<NotificationDto> result;

            if (role == "Admin")
            {
                result = await _notificationService.GetPagedAsync(query);
            }
            else
            {
                result = await _notificationService.GetPagedByRoleAsync(role, query);
            }

            return Ok(result);
        }

        /// <summary>🔍 Lấy thông báo cụ thể theo ID</summary>
        [HttpGet("{id}")]
        [Authorize(Policy = "notification:view")]
        public async Task<IActionResult> GetNotificationById(int id)
        {
            var notification = await _notificationService.GetByIdAsync(id);
            if (notification == null)
                return NotFound("Không tìm thấy thông báo.");
            return Ok(notification);
        }

        /// <summary>📝 Tạo mới thông báo (chỉ Admin)</summary>
        [HttpPost]
        [Authorize(Policy = "notification:create")]
        public async Task<IActionResult> CreateNotification([FromBody] CreateNotificationDto dto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out int userId))
                return Unauthorized("Không xác định được người tạo.");

            var success = await _notificationService.CreateAsync(dto, userId);
            if (!success)
                return BadRequest("Tạo thông báo thất bại.");

            return Ok("Tạo thông báo thành công.");
        }
    }
}
