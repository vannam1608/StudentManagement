using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.DTOs.Subject;
using StudentManagementAPI.Interfaces.Services;

namespace StudentManagementAPI.Controllers
{
    [ApiController]
    [Route("api/subjects")]
    [Authorize] // Toàn bộ controller yêu cầu xác thực
    public class SubjectController : ControllerBase
    {
        private readonly ISubjectService _subjectService;

        public SubjectController(ISubjectService subjectService)
        {
            _subjectService = subjectService;
        }

        /// <summary>Danh sách tất cả môn học (Admin hoặc Student)</summary>
        [HttpGet]
        [Authorize(Policy = "subject:view")]
        public async Task<IActionResult> GetAll()
        {
            var subjects = await _subjectService.GetAllAsync();
            return Ok(subjects);
        }

        /// <summary>Lấy thông tin môn học theo Id</summary>
        [HttpGet("{id}")]
        [Authorize(Policy = "subject:view")]
        public async Task<IActionResult> GetById(int id)
        {
            var subject = await _subjectService.GetByIdAsync(id);
            if (subject == null)
                return NotFound(new { message = "❌ Không tìm thấy môn học với ID đã cho." });

            return Ok(subject);
        }

        /// <summary>Tạo môn học mới (Admin)</summary>
        [HttpPost]
        [Authorize(Policy = "subject:create")]
        public async Task<IActionResult> Create([FromBody] SubjectDto dto)
        {
            var result = await _subjectService.CreateAsync(dto);
            if (result)
                return Ok(new { message = "✅ Tạo môn học thành công." });

            return BadRequest(new { message = "❌ Không thể tạo môn học. Vui lòng kiểm tra lại thông tin." });
        }

        /// <summary>Cập nhật môn học (Admin)</summary>
        [HttpPut("{id}")]
        [Authorize(Policy = "subject:update")]
        public async Task<IActionResult> Update(int id, [FromBody] SubjectDto dto)
        {
            var result = await _subjectService.UpdateAsync(id, dto);
            if (result)
                return Ok(new { message = "✅ Cập nhật môn học thành công." });

            return NotFound(new { message = "❌ Không tìm thấy môn học để cập nhật." });
        }

        /// <summary>Xoá môn học (Admin)</summary>
        [HttpDelete("{id}")]
        [Authorize(Policy = "subject:delete")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _subjectService.DeleteAsync(id);
            if (result)
                return Ok(new { message = "🗑️ Xóa môn học thành công." });

            return NotFound(new { message = "❌ Không tìm thấy môn học để xóa." });
        }

        /// <summary>Tìm kiếm môn học theo tên (Admin hoặc Student)</summary>
        [HttpGet("search")]
        [Authorize(Policy = "subject:view")]
        public async Task<IActionResult> SearchByName([FromQuery] string name)
        {
            var results = await _subjectService.SearchByNameAsync(name);
            return Ok(results);
        }

        /// <summary>Danh sách môn học có thể đăng ký (chỉ Student)</summary>
        [HttpGet("available")]
        [Authorize(Policy = "subject:register")]
        public async Task<IActionResult> GetAvailableSubjectsBySemester([FromQuery] int semesterId)
        {
            var subjects = await _subjectService.GetAvailableSubjectsBySemesterAsync(semesterId);
            return Ok(subjects);
        }
    }
}
