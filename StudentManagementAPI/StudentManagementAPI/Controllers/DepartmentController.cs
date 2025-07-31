using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.DTOs.Department;
using StudentManagementAPI.Interfaces.Services;

namespace StudentManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require JWT
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _service;

        public DepartmentController(IDepartmentService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Policy = "department:view")]
        public async Task<IActionResult> GetAll()
        {
            var departments = await _service.GetAllAsync();
            return Ok(departments);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "department:view")]
        public async Task<IActionResult> GetById(int id)
        {
            var department = await _service.GetByIdAsync(id);
            if (department == null)
                return NotFound("Không tìm thấy khoa");
            return Ok(department);
        }

        [HttpPost]
        [Authorize(Policy = "department:create")]
        public async Task<IActionResult> Create([FromBody] CreateDepartmentDto dto)
        {
            var created = await _service.CreateAsync(dto);
            if (!created)
                return BadRequest("Tạo khoa thất bại");
            return Ok("Tạo khoa thành công");
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "department:update")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateDepartmentDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (!updated)
                return NotFound("Không tìm thấy khoa cần cập nhật");
            return Ok("Cập nhật thành công");
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "department:delete")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted)
                return NotFound("Không tìm thấy khoa cần xóa");
            return Ok("Xóa thành công");
        }
    }
}
