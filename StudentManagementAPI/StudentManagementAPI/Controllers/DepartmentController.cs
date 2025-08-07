using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.DTOs.Department;
using StudentManagementAPI.Interfaces.Services;

namespace StudentManagementAPI.Controllers
{
    [ApiController]
    [Route("api/departments")]
    [Authorize]
    [Tags("Quản lý khoa")]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _service;

        public DepartmentController(IDepartmentService service)
        {
            _service = service;
        }

        // ✅ Lấy tất cả khoa
        [HttpGet]
        [Authorize(Policy = "department:view")]
        [ProducesResponseType(typeof(IEnumerable<DepartmentDto>), 200)]
        public async Task<IActionResult> GetAll()
        {
            var departments = await _service.GetAllAsync();
            return Ok(departments);
        }

        // ✅ Lấy khoa theo ID
        [HttpGet("{id}")]
        [Authorize(Policy = "department:view")]
        [ProducesResponseType(typeof(DepartmentDto), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetById(int id)
        {
            var department = await _service.GetByIdAsync(id);
            if (department == null)
                return NotFound(new { message = "Không tìm thấy khoa" });

            return Ok(department);
        }

        // ✅ Tạo khoa mới
        [HttpPost]
        [Authorize(Policy = "department:create")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<IActionResult> Create([FromBody] CreateDepartmentDto dto)
        {
            var created = await _service.CreateAsync(dto);
            if (!created)
                return BadRequest(new { message = "Tạo khoa thất bại" });

            return Ok(new { message = "Tạo khoa thành công" });
        }

        // ✅ Cập nhật khoa
        [HttpPut("{id}")]
        [Authorize(Policy = "department:update")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 404)]
        public async Task<IActionResult> Update(int id, [FromBody] CreateDepartmentDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (!updated)
                return NotFound(new { message = "Không tìm thấy khoa cần cập nhật" });

            return Ok(new { message = "Cập nhật thành công" });
        }

        // ✅ Xoá khoa
        [HttpDelete("{id}")]
        [Authorize(Policy = "department:delete")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 404)]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted)
                return NotFound(new { message = "Không tìm thấy khoa cần xóa" });

            return Ok(new { message = "Xóa thành công" });
        }
    }
}
