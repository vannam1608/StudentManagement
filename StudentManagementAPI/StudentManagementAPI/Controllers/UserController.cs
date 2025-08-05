using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.DTOs.Common;
using StudentManagementAPI.DTOs.Student;
using StudentManagementAPI.DTOs.Subject;
using StudentManagementAPI.DTOs.Teacher;
using StudentManagementAPI.DTOs.User;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Models.Common;

namespace StudentManagementAPI.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize]
    [Tags("Quản lý người dùng")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // ---------------- USERS -----------------

        [HttpGet]
        [Authorize(Policy = "user:view")]
        [ProducesResponseType(typeof(IEnumerable<UserDto>), 200)]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "user:view")]
        [ProducesResponseType(typeof(UserDto), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            return user == null
                ? NotFound(new { message = "Không tìm thấy người dùng" })
                : Ok(user);
        }

        [HttpPost]
        [Authorize(Policy = "user:create")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _userService.CreateAsync(dto);
            return created
                ? Ok(new { message = "Tạo người dùng thành công" })
                : BadRequest(new { message = "Tạo người dùng thất bại" });
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "user:update")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
        {
            var updated = await _userService.UpdateAsync(id, dto);
            return updated
                ? Ok(new { message = "Cập nhật thành công" })
                : NotFound(new { message = "Không tìm thấy người dùng cần cập nhật" });
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "user:delete")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var deleted = await _userService.DeleteAsync(id);
            return deleted
                ? Ok(new { message = "Xóa thành công" })
                : NotFound(new { message = "Không tìm thấy người dùng cần xóa" });
        }

        [HttpGet("credentials")]
        [Authorize(Policy = "user:credential")]
        public async Task<IActionResult> GetCredentials()
        {
            var users = await _userService.GetUserCredentialsAsync();
            return Ok(users);
        }

        [HttpPut("{id}/password")]
        [Authorize(Policy = "user:password")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] string newPassword)
        {
            var result = await _userService.ChangePasswordAsync(id, newPassword);
            return result
                ? Ok(new { message = "Đổi mật khẩu thành công" })
                : NotFound(new { message = "Không tìm thấy người dùng" });
        }

        [HttpPut("{id}/role")]
        [Authorize(Policy = "user:role")]
        public async Task<IActionResult> ChangeRole(int id, [FromBody] string newRole)
        {
            var result = await _userService.ChangeRoleAsync(id, newRole);
            return result
                ? Ok(new { message = "Gán quyền thành công" })
                : NotFound(new { message = "Không tìm thấy người dùng" });
        }

        [HttpGet("credentials/paged")]
        [Authorize(Policy = "user:credential")]
        public async Task<IActionResult> GetPagedCredentials([FromQuery] PaginationQueryDto query)
        {
            var result = await _userService.GetPagedCredentialsAsync(query);
            return Ok(result);
        }




        // ---------------- STUDENTS -----------------

        [HttpGet("students")]
        [Authorize(Policy = "student:view")]
        [ProducesResponseType(typeof(IEnumerable<StudentDto>), 200)]
        public async Task<IActionResult> GetAllStudents()
        {
            var students = await _userService.GetAllStudentsAsync();
            return Ok(students);
        }

        [HttpGet("students/{id}")]
        [Authorize(Policy = "student:view")]
        [ProducesResponseType(typeof(StudentDto), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetStudentById(int id)
        {
            var student = await _userService.GetStudentByIdAsync(id);
            return student == null
                ? NotFound(new { message = "Không tìm thấy sinh viên" })
                : Ok(student);
        }

        [HttpPost("students")]
        [Authorize(Policy = "student:create")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateStudent([FromBody] CreateStudentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _userService.CreateStudentAsync(dto);
            return created
                ? Ok(new { message = "Tạo sinh viên thành công" })
                : BadRequest(new { message = "Tạo sinh viên thất bại (Username đã tồn tại hoặc lỗi dữ liệu)" });
        }

        [HttpPut("students/{id}")]
        [Authorize(Policy = "student:update")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] UpdateStudentDto dto)
        {
            var updated = await _userService.UpdateStudentAsync(id, dto);
            return updated
                ? Ok(new { message = "Cập nhật sinh viên thành công" })
                : NotFound(new { message = "Không tìm thấy sinh viên cần cập nhật" });
        }

        [HttpPost("students/{studentId}/register")]
        [Authorize(Policy = "subject:register_any")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> RegisterSubjectForStudent(int studentId, [FromBody] RegisterSubjectDto dto)
        {
            var result = await _userService.RegisterSubjectForStudentAsync(studentId, dto);
            return result
                ? Ok(new { message = "Đăng ký môn học thành công" })
                : BadRequest(new { message = "Đăng ký thất bại. Môn học không tồn tại hoặc đã đăng ký trước." });
        }

        [HttpDelete("students/{studentId}/enrollments/{enrollmentId}")]
        [Authorize(Policy = "subject:unregister_any")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> CancelEnrollmentForStudent(int studentId, int enrollmentId)
        {
            var result = await _userService.CancelEnrollmentAsync(studentId, enrollmentId);
            return result
                ? Ok(new { message = "Hủy đăng ký môn học thành công" })
                : NotFound(new { message = "Không tìm thấy đăng ký môn học cần hủy" });
        }


        // ---------------- TEACHERS -----------------

        [HttpPost("teachers")]
        [Authorize(Policy = "teacher:create")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateTeacher([FromBody] CreateTeacherDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _userService.CreateTeacherAsync(dto);
            return created
                ? Ok(new { message = "Tạo giảng viên thành công" })
                : BadRequest(new { message = "Tạo giảng viên thất bại" });
        }


        [HttpGet("paged")]
        [Authorize(Policy = "user:view")]
        public async Task<IActionResult> GetPaged([FromQuery] PaginationQueryDto query)
        {
            var result = await _userService.GetPagedAsync(query);
            return Ok(result);
        }

    }
}
