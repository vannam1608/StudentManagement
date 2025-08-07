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
            return new JsonResult(programs) { StatusCode = 200 };
        }

        // ✅ Tạo chương trình mới
        [HttpPost]
        [Authorize(Policy = "educationprogram:create")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<IActionResult> Create([FromBody] CreateEducationProgramDto dto)
        {
            var result = await _service.CreateAsync(dto);
            if (result)
                return new JsonResult(new { message = "Tạo thành công" }) { StatusCode = 200 };

            return new JsonResult(new { message = "Tạo thất bại" }) { StatusCode = 400 };
        }

        // ✅ Xoá chương trình
        [HttpDelete("{id}")]
        [Authorize(Policy = "educationprogram:delete")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 404)]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (result)
                return new JsonResult(new { message = "Xóa thành công" }) { StatusCode = 200 };

            return new JsonResult(new { message = "Không tìm thấy chương trình" }) { StatusCode = 404 };
        }
    }
}
