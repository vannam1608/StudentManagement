using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.DTOs.EducationProgram;
using StudentManagementAPI.Interfaces.Services;

namespace StudentManagementAPI.Controllers
{
    [ApiController]
    [Route("api/programs")]
    [Authorize]
    [Tags("Quản lý chương trình đào tạo")]
    public class EducationProgramController : ControllerBase
    {
        private readonly IEducationProgramService _service;

        public EducationProgramController(IEducationProgramService service)
        {
            _service = service;
        }

        // ✅ Lấy tất cả chương trình
        [HttpGet]
        [Authorize(Policy = "educationprogram:view")]
        [ProducesResponseType(typeof(IEnumerable<EducationProgramDto>), 200)]
        public async Task<IActionResult> GetAll()
        {
            var programs = await _service.GetAllAsync();
            return Ok(programs);
        }

        // ✅ Tạo chương trình mới
        [HttpPost]
        [Authorize(Policy = "educationprogram:create")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Create([FromBody] CreateEducationProgramDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return result
                ? Ok(new { message = "Tạo thành công" })
                : BadRequest(new { message = "Tạo thất bại" });
        }

        // ✅ Xoá chương trình
        [HttpDelete("{id}")]
        [Authorize(Policy = "educationprogram:delete")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            return result
                ? Ok(new { message = "Xóa thành công" })
                : NotFound(new { message = "Không tìm thấy chương trình" });
        }
    }
}
