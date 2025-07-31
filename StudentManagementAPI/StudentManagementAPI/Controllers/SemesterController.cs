using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.DTOs.Semester;
using StudentManagementAPI.Interfaces.Services;

namespace StudentManagementAPI.Controllers
{
    [ApiController]
    [Route("api/semesters")]
    public class SemesterController : ControllerBase
    {
        private readonly ISemesterService _service;

        public SemesterController(ISemesterService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Policy = "semester:view")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "semester:view")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return result is null
                ? NotFound(new { message = "❌ Không tìm thấy học kỳ." })
                : Ok(result);
        }

        [HttpPost]
        [Authorize(Policy = "semester:create")]
        public async Task<IActionResult> Create([FromBody] CreateSemesterDto dto)
        {
            var success = await _service.CreateAsync(dto);
            return success
                ? Ok(new { message = "✅ Tạo học kỳ thành công." })
                : BadRequest(new { message = "❌ Tạo học kỳ thất bại." });
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "semester:update")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateSemesterDto dto)
        {
            var success = await _service.UpdateAsync(id, dto);
            return success
                ? Ok(new { message = "✅ Cập nhật học kỳ thành công." })
                : NotFound(new { message = "❌ Không tìm thấy học kỳ để cập nhật." });
        }

        //[HttpDelete("{id}")]
        //[Authorize(Policy = "semester:update")]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    var success = await _service.DeleteAsync(id);
        //    return success
        //        ? Ok(new { message = "🗑️ Đã xoá học kỳ." })
        //        : NotFound(new { message = "❌ Không tìm thấy học kỳ để xoá." });
        //}

        [HttpPost("{id}/toggle")]
        [Authorize(Policy = "semester:toggle")]
        public async Task<IActionResult> Toggle(int id)
        {
            var result = await _service.ToggleAsync(id);
            if (!result)
                return BadRequest(new { message = "❌ Không thể chuyển trạng thái học kỳ (có thể chưa đến ngày học)." });

            return Ok(new { message = "✅ Đã chuyển trạng thái học kỳ." });
        }
    }
}
