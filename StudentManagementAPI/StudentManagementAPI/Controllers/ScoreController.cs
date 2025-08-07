using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.DTOs.Score;
using StudentManagementAPI.Interfaces.Services;
using System.Security.Claims;

namespace StudentManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScoreController : ControllerBase
    {
        private readonly IScoreService _scoreService;

        public ScoreController(IScoreService scoreService)
        {
            _scoreService = scoreService;
        }

        // ========================
        // ===== ADMIN / TEACHER ======
        // ========================

        /// <summary>Lấy tất cả điểm của sinh viên (Admin/Teacher)</summary>
        [HttpGet("all")]
        [Authorize(Policy = "score:view_all")]
        [ProducesResponseType(typeof(IEnumerable<ScoreDto>), 200)]
        public async Task<IActionResult> GetAll()
        {
            var scores = await _scoreService.GetAllAsync();
            return Ok(scores);
        }

        /// <summary>Lấy điểm theo mã đăng ký học (Admin / Teacher)</summary>
        [HttpGet("enrollment/{enrollmentId}")]
        [Authorize(Policy = "score:view")]
        [ProducesResponseType(typeof(ScoreDto), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetByEnrollmentId(int enrollmentId)
        {
            var score = await _scoreService.GetByEnrollmentIdAsync(enrollmentId);
            return score == null ? NotFound("Không tìm thấy điểm.") : Ok(score);
        }

        /// <summary>Lấy danh sách điểm của sinh viên theo ID (Admin)</summary>
        [HttpGet("student/{studentId}")]
        [Authorize(Policy = "score:view_by_student")]
        [ProducesResponseType(typeof(IEnumerable<ScoreDto>), 200)]
        public async Task<IActionResult> GetByStudentId(int studentId)
        {
            var scores = await _scoreService.GetByStudentIdAsync(studentId);
            return Ok(scores);
        }

        /// <summary>Nhập hoặc cập nhật điểm cho sinh viên (Admin / Teacher)</summary>
        [HttpPost("input")]
        [Authorize(Policy = "score:input")]
        [ProducesResponseType(typeof(ScoreDto), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> InputScore(InputScoreDto dto)
        {
            var result = await _scoreService.InputScoreAsync(dto);
            if (!result)
                return BadRequest("Không thể nhập điểm. Có thể chưa đến ngày học hoặc chưa có bản ghi.");

            var score = await _scoreService.GetByEnrollmentIdAsync(dto.EnrollmentId);
            return Ok(score);
        }

        /// <summary>Tự động tạo bản ghi điểm cho các đăng ký học chưa có điểm (Admin)</summary>
        [HttpPost("auto-create")]
        [Authorize(Policy = "score:auto_create")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> AutoCreateScoreEntries()
        {
            var count = await _scoreService.CreateMissingScoresAsync();
            return Ok(new { message = $"Đã tạo {count} bản ghi điểm mới." });
        }

        // ========================
        // ===== STUDENT ZONE =====
        // ========================

        /// <summary>Sinh viên xem tất cả điểm của mình</summary>
        [HttpGet("my")]
        [Authorize(Policy = "score:view_self")]
        [ProducesResponseType(typeof(IEnumerable<ScoreDto>), 200)]
        public async Task<IActionResult> GetMyScores()
        {
            var studentIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(studentIdStr, out int studentId))
                return Unauthorized("Không xác định được sinh viên.");

            var scores = await _scoreService.GetByStudentIdAsync(studentId);
            return Ok(scores);
        }

        /// <summary>Sinh viên xem điểm một môn học cụ thể</summary>
        [HttpGet("my/subject/{subjectId}")]
        [Authorize(Policy = "score:view_self")]
        [ProducesResponseType(typeof(ScoreDto), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetMyScoreBySubject(int subjectId)
        {
            var studentIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(studentIdStr, out int studentId))
                return Unauthorized("Không xác định được sinh viên.");

            var score = await _scoreService.GetByStudentAndSubjectAsync(studentId, subjectId);
            return score == null
                ? NotFound("Bạn chưa có điểm cho môn học này.")
                : Ok(score);
        }

        /// <summary>Giáo viên xem điểm của tất cả lớp mình dạy</summary>
        [HttpGet("my-class")]
        [Authorize(Policy = "score:view_my_class")]

        [ProducesResponseType(typeof(IEnumerable<ScoreDto>), 200)]
        public async Task<IActionResult> GetScoresForMyClasses()
        {
            var teacherIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(teacherIdStr, out int teacherId))
                return Unauthorized("Không xác định được giáo viên.");

            var scores = await _scoreService.GetScoresByTeacherIdAsync(teacherId);
            return Ok(scores);
        }


        [HttpGet("paged")]
        [Authorize(Policy = "score:view_all")]
        public async Task<IActionResult> GetPaged(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10,
    [FromQuery] string? studentCode = null,
    [FromQuery] string? classCode = null)
        {
            var result = await _scoreService.GetPagedAsync(page, pageSize, studentCode, classCode);
            return Ok(result);
        }


        /// <summary>Lấy điểm của sinh viên và nhóm theo học kỳ</summary>
        [HttpGet("grouped-by-semester/{studentId}")]    
        [Authorize(Policy = "score:view_by_student")]
        [ProducesResponseType(typeof(Dictionary<string, List<ScoreDto>>), 200)]
        public async Task<IActionResult> GetScoresGroupedBySemester(int studentId)
        {
            var groupedScores = await _scoreService.GetScoresGroupedBySemesterAsync(studentId);
            return Ok(groupedScores);
        }



    }
}
