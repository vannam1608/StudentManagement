using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.DTOs.Student;
using StudentManagementAPI.DTOs.Subject;
using StudentManagementAPI.DTOs.Score;
using StudentManagementAPI.Interfaces.Services;
using System.Security.Claims;

namespace StudentManagementAPI.Controllers
{
    [ApiController]
    [Route("api/student")]
    [Authorize(Roles = "Student")] 
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        /// <summary>Lấy studentId từ JWT token</summary>
        private int GetCurrentStudentId()
        {
            var claimValue = User.FindFirst("studentId")?.Value
                          ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(claimValue) || !int.TryParse(claimValue, out int studentId))
            {
                throw new UnauthorizedAccessException("studentId claim không hợp lệ hoặc chưa đăng nhập.");
            }

            return studentId;
        }

        /// <summary>Lấy thông tin cá nhân sinh viên</summary>
        [HttpGet("me")]
        [Authorize(Policy = "student:view_self")]
        public async Task<IActionResult> GetProfile()
        {
            var studentId = GetCurrentStudentId();
            var student = await _studentService.GetByIdAsync(studentId);
            return student == null ? NotFound("Không tìm thấy sinh viên.") : Ok(student);
        }

        /// <summary>Cập nhật thông tin cá nhân</summary>
        [HttpPut("me")]
        [Authorize(Policy = "student:update_self")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateStudentDto dto)
        {
            var studentId = GetCurrentStudentId();
            var result = await _studentService.UpdateAsync(studentId, dto);
            return result ? Ok("Cập nhật thành công.") : NotFound("Không tìm thấy sinh viên.");
        }

        /// <summary>Đăng ký môn học</summary>
        [HttpPost("register")]
        [Authorize(Policy = "subject:register")]
        public async Task<IActionResult> RegisterSubject([FromBody] RegisterSubjectDto dto)
        {
            var studentId = GetCurrentStudentId();
            var result = await _studentService.RegisterSubjectAsync(studentId, dto);

            if (result)
                return Ok(new { success = true, message = "Đăng ký thành công." });

            return BadRequest(new { success = false, message = "Đăng ký thất bại." });
        }


        /// <summary>Danh sách môn học đã đăng ký</summary>
        [HttpGet("my-subjects")]
        [Authorize(Policy = "subject:view_self")]
        public async Task<IActionResult> GetMySubjects()
        {
            var studentId = GetCurrentStudentId();
            var subjects = await _studentService.GetRegisteredSubjectsAsync(studentId);
            return Ok(subjects);
        }

        /// <summary>Xem lịch học và lịch thi</summary>
        [HttpGet("schedule")]
        [Authorize(Policy = "schedule:view_self")]
        public async Task<IActionResult> GetSchedule()
        {
            var studentId = GetCurrentStudentId();
            var schedule = await _studentService.GetScheduleAsync(studentId);
            return Ok(schedule);
        }

        /// <summary>Xem điểm số của bản thân</summary>
        [HttpGet("scores")]
        [Authorize(Policy = "score:view_self")]
        public async Task<IActionResult> GetScores()
        {
            var studentId = GetCurrentStudentId();
            var scores = await _studentService.GetScoresAsync(studentId);
            return Ok(scores);
        }
    }
}