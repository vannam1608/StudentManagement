using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.DTOs.Teacher;
using StudentManagementAPI.Interfaces.Services;
using System.Security.Claims;

namespace StudentManagementAPI.Controllers
{
    [ApiController]
    [Route("api/teachers")]
    public class TeacherController : ControllerBase
    {
        private readonly ITeacherService _teacherService;

        public TeacherController(ITeacherService teacherService)
        {
            _teacherService = teacherService;
        }

        /// <summary>Lấy danh sách tất cả giảng viên (chỉ Admin)</summary>
        [HttpGet]
        [Authorize(Policy = "teacher:view")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _teacherService.GetAllAsync();
            return Ok(result);
        }
        /// <summary>Lấy thông tin của giảng viên hiện tại (dựa trên token)</summary>
        [HttpGet("me")]
        [Authorize(Policy = "teacher:view_self")]
        public async Task<IActionResult> GetMe()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Không thể xác định giảng viên." });
            }

            var result = await _teacherService.GetByIdAsync(userId);
            return result == null
                ? NotFound(new { message = "❌ Không tìm thấy thông tin giảng viên." })
                : Ok(result);
        }

        /// <summary>Lấy thông tin giảng viên theo ID (Admin hoặc chính giảng viên)</summary>
        [HttpGet("{id}")]
        [Authorize(Policy = "teacher:view_self")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "";

            if (role != "Admin" && userId != id)
                return Forbid("Bạn không có quyền truy cập thông tin giảng viên này.");

            var result = await _teacherService.GetByIdAsync(id);
            return result == null
                ? NotFound(new { message = "❌ Không tìm thấy giảng viên." })
                : Ok(result);
        }

        /// <summary>Thêm mới giảng viên (chỉ Admin)</summary>
        [HttpPost]
        [Authorize(Policy = "teacher:create")]
        public async Task<IActionResult> Create([FromBody] CreateTeacherDto dto)
        {
            var success = await _teacherService.CreateAsync(dto);
            return success
                ? Ok(new { message = "✅ Tạo giảng viên thành công." })
                : BadRequest(new { message = "❌ Tạo giảng viên thất bại. Vui lòng kiểm tra lại dữ liệu." });
        }

        /// <summary>Cập nhật thông tin giảng viên (Admin hoặc chính giảng viên)</summary>
        [HttpPut("{id}")]
        [Authorize(Policy = "teacher:update_self")]
        public async Task<IActionResult> Update(int id, [FromBody] TeacherDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "";

            if (role != "Admin" && userId != id)
                return Forbid("Bạn không có quyền cập nhật thông tin giảng viên này.");

            var success = await _teacherService.UpdateAsync(id, dto);
            return success
                ? Ok(new { message = "✅ Cập nhật giảng viên thành công." })
                : NotFound(new { message = "❌ Không tìm thấy giảng viên cần cập nhật." });
        }

        /// <summary>Xoá giảng viên (chỉ Admin)</summary>
        [HttpDelete("{id}")]
        [Authorize(Policy = "teacher:delete")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _teacherService.DeleteAsync(id);
            return success
                ? Ok(new { message = "✅ Xoá giảng viên thành công." })
                : NotFound(new { message = "❌ Không tìm thấy giảng viên cần xoá." });
        }
    }
}
