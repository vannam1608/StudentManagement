using StudentManagementAPI.DTOs.Teacher;
using StudentManagementAPI.Models.Common;

namespace StudentManagementAPI.Interfaces.Services
{
    public interface ITeacherService
    {
        Task<IEnumerable<TeacherDto>> GetAllAsync();
        Task<TeacherDto?> GetByIdAsync(int id);
        Task<bool> CreateAsync(CreateTeacherDto dto);
        Task<bool> UpdateAsync(int id, TeacherDto dto);
        Task<bool> DeleteAsync(int id);

        // ✅ Thêm tìm kiếm theo mã giảng viên (optional)
        Task<PaginatedResult<TeacherDto>> GetPagedAsync(int page, int pageSize, string? teacherCode = null);
    }
}
