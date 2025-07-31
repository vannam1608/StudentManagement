using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.DTOs.CourseClass;
using StudentManagementAPI.Interfaces.Services;

namespace StudentManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Yêu cầu xác thực JWT cho toàn bộ controller
    public class CourseClassController : ControllerBase
    {
        private readonly ICourseClassService _courseClassService;

        public CourseClassController(ICourseClassService courseClassService)
        {
            _courseClassService = courseClassService;
        }

        /// <summary>Lấy danh sách tất cả lớp học phần</summary>
        [HttpGet]
        [Authorize(Policy = "courseclass:view")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _courseClassService.GetAllAsync();
            return Ok(result);
        }

        /// <summary>Lấy lớp học phần theo ID</summary>
        [HttpGet("{id}")]
        [Authorize(Policy = "courseclass:view")]
        public async Task<IActionResult> GetById(int id)
        {
            var courseClass = await _courseClassService.GetByIdAsync(id);
            if (courseClass == null) return NotFound();
            return Ok(courseClass);
        }

        /// <summary>Lấy lớp học phần theo môn học</summary>
        [HttpGet("subject/{subjectId}")]
        [Authorize(Policy = "courseclass:view")]
        public async Task<IActionResult> GetBySubject(int subjectId)
        {
            var classes = await _courseClassService.GetBySubjectIdAsync(subjectId);
            return Ok(classes);
        }

        /// <summary>Lấy lớp học phần theo giảng viên</summary>
        [HttpGet("teacher/{teacherId}")]
        [Authorize(Policy = "courseclass:view_assigned")]
        public async Task<IActionResult> GetByTeacher(int teacherId)
        {
            var classes = await _courseClassService.GetByTeacherIdAsync(teacherId);
            return Ok(classes);
        }

        /// <summary>Lọc lớp học phần theo học kỳ</summary>
        [HttpGet("semester/{semesterId}")]
        [Authorize(Policy = "courseclass:view")]
        public async Task<IActionResult> GetBySemester(int semesterId)
        {
            var all = await _courseClassService.GetAllAsync();
            var filtered = all.Where(c => c.SemesterName.Contains($"HK{semesterId}")).ToList();
            return Ok(filtered);
        }

        /// <summary>Tạo lớp học phần</summary>
        [HttpPost]
        [Authorize(Policy = "courseclass:create")]
        public async Task<IActionResult> Create([FromBody] CreateCourseClassDto dto)
        {
            var created = await _courseClassService.CreateAsync(dto);
            if (!created) return BadRequest("Creation failed.");
            return Ok("Course class created successfully.");
        }

        /// <summary>Cập nhật lớp học phần</summary>
        [HttpPut("{id}")]
        [Authorize(Policy = "courseclass:update")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateCourseClassDto dto)
        {
            var updated = await _courseClassService.UpdateAsync(id, dto);
            if (!updated) return NotFound("Course class not found.");
            return Ok("Course class updated successfully.");
        }

        /// <summary>Xóa lớp học phần</summary>
        [HttpDelete("{id}")]
        [Authorize(Policy = "courseclass:delete")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _courseClassService.DeleteAsync(id);
            if (!deleted) return NotFound("Course class not found.");
            return Ok("Course class deleted successfully.");
        }
    }
}
