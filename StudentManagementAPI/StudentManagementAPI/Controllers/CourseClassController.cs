using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.DTOs.Common;
using StudentManagementAPI.DTOs.CourseClass;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Models.Common;

namespace StudentManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CourseClassController : ControllerBase
    {
        private readonly ICourseClassService _courseClassService;

        public CourseClassController(ICourseClassService courseClassService)
        {
            _courseClassService = courseClassService;
        }

        [HttpGet]
        [Authorize(Policy = "courseclass:view")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _courseClassService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "courseclass:view")]
        public async Task<IActionResult> GetById(int id)
        {
            var courseClass = await _courseClassService.GetByIdAsync(id);
            return courseClass == null
                ? NotFound(new { message = "Không tìm thấy lớp học phần" })
                : Ok(courseClass);
        }

        [HttpGet("subject/{subjectId}")]
        [Authorize(Policy = "courseclass:view")]
        public async Task<IActionResult> GetBySubject(int subjectId)
        {
            var classes = await _courseClassService.GetBySubjectIdAsync(subjectId);
            return Ok(classes);
        }

        [HttpGet("teacher/{teacherId}")]
        [Authorize(Policy = "courseclass:view_assigned")]
        public async Task<IActionResult> GetByTeacher(int teacherId)
        {
            var classes = await _courseClassService.GetByTeacherIdAsync(teacherId);
            return Ok(classes);
        }

        [HttpGet("semester/{semesterId}")]
        [Authorize(Policy = "courseclass:view")]
        public async Task<IActionResult> GetBySemester(int semesterId)
        {
            var all = await _courseClassService.GetAllAsync();
            var filtered = all.Where(c => c.SemesterName.Contains($"HK{semesterId}")).ToList();
            return Ok(filtered);
        }

        [HttpPost]
        [Authorize(Policy = "courseclass:create")]
        public async Task<IActionResult> Create([FromBody] CreateCourseClassDto dto)
        {
            var created = await _courseClassService.CreateAsync(dto);
            return created
                ? Ok(new { message = "Tạo lớp học phần thành công" })
                : BadRequest(new { message = "Tạo lớp học phần thất bại" });
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "courseclass:update")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateCourseClassDto dto)
        {
            var updated = await _courseClassService.UpdateAsync(id, dto);
            return updated
                ? Ok(new { message = "Cập nhật lớp học phần thành công" })
                : NotFound(new { message = "Không tìm thấy lớp học phần cần cập nhật" });
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "courseclass:delete")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _courseClassService.DeleteAsync(id);
            return deleted

                ? Ok(new { message = "Xóa lớp học phần thành công" })
                : NotFound(new { message = "Không tìm thấy lớp học phần cần xóa" });
        }

        [HttpGet("paged")]
        [Authorize(Policy = "courseclass:view")]
        public async Task<IActionResult> GetPagedAsync([FromQuery] PaginationQueryDto paginationDto)
        {
            var result = await _courseClassService.GetPagedAsync(paginationDto);
            return Ok(result);
        }
    }
}
