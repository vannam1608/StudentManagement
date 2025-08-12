using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.DTOs.Common;
using StudentManagementAPI.DTOs.Enrollment;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Models.Common;

namespace StudentManagementAPI.Controllers
{
    /// <summary>
    /// 📚 API quản lý đăng ký học phần của sinh viên
    /// </summary>
    [ApiController]
    [Route("api/enrollments")]
    [Authorize]
    [Tags("Quản lý đăng ký học phần")]
    public class EnrollmentController : ControllerBase
    {
        private readonly IEnrollmentService _enrollmentService;

        public EnrollmentController(IEnrollmentService enrollmentService)
        {
            _enrollmentService = enrollmentService;
        }

        /// <summary>📋 Danh sách tất cả đăng ký học phần</summary>
        [HttpGet]
        [Authorize(Policy = "enrollment:view")]
        [ProducesResponseType(typeof(IEnumerable<EnrollmentDto>), 200)]
        public async Task<IActionResult> GetAllEnrollments()
        {
            var enrollments = await _enrollmentService.GetAllAsync();
            return Ok(enrollments);
        }

        /// <summary>🔍 Tìm kiếm đăng ký học phần (lọc theo studentId, studentCode, semesterId, subjectName)</summary>
        [HttpGet("search")]
        [Authorize(Policy = "enrollment:view")]
        [ProducesResponseType(typeof(IEnumerable<EnrollmentDto>), 200)]
        public async Task<IActionResult> SearchEnrollments(
    [FromQuery] string? studentId,
    [FromQuery] string? studentCode,
    [FromQuery] string? semesterId,
    [FromQuery] string? subjectName)
        {
            int? studentIdParsed = null;
            if (int.TryParse(studentId, out var sid))
                studentIdParsed = sid;

            int? semesterIdParsed = null;
            if (int.TryParse(semesterId, out var semid))
                semesterIdParsed = semid;

            var result = await _enrollmentService.SearchAsync(
                studentIdParsed,
                semesterIdParsed,
                studentCode,
                subjectName);

            if (!result.Data.Any())
                return NotFound("Không tìm thấy kết quả phù hợp.");

            return Ok(result);

        }


        /// <summary>🆕 Sinh viên đăng ký lớp học phần mới</summary>
        [HttpPost]
        [Authorize(Policy = "enrollment:create")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateEnrollment([FromBody] CreateEnrollmentDto dto)
        {
            var id = await _enrollmentService.CreateAsync(dto);
            if (id <= 0)
                return BadRequest("Tạo đăng ký thất bại.");
            return Ok(new { message = "✅ Đăng ký thành công", id });
        }

        /// <summary>✏️ Cập nhật đăng ký học phần</summary>
        [HttpPut("{id}")]
        [Authorize(Policy = "enrollment:update")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateEnrollment(int id, [FromBody] CreateEnrollmentDto dto)
        {
            var updated = await _enrollmentService.UpdateAsync(id, dto);
            if (!updated)
                return NotFound("Không tìm thấy đăng ký cần cập nhật.");
            return Ok("✅ Cập nhật đăng ký thành công.");
        }

        /// <summary>🗑️ Hủy đăng ký học phần</summary>
        [HttpDelete("{id}")]
        [Authorize(Policy = "enrollment:delete")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteEnrollment(int id)
        {
            var deleted = await _enrollmentService.DeleteAsync(id);
            if (!deleted)
                return NotFound("Không tìm thấy đăng ký cần xóa.");
            return Ok("✅ Đã hủy đăng ký thành công.");
        }

        /// <summary>📄 Danh sách đăng ký học phần có phân trang</summary>
        [HttpGet("paged")]
        [Authorize(Policy = "enrollment:view")]
        [ProducesResponseType(typeof(PaginatedResult<EnrollmentDto>), 200)]
        public async Task<IActionResult> GetPagedEnrollments([FromQuery] PaginationQueryDto paginationDto)
        {
            var result = await _enrollmentService.GetPagedAsync(paginationDto);
            return Ok(result);
        }
    }
}
