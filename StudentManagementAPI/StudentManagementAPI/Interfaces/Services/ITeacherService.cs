using StudentManagementAPI.DTOs.Teacher;

namespace StudentManagementAPI.Interfaces.Services
{
    public interface ITeacherService
    {
        Task<IEnumerable<TeacherDto>> GetAllAsync();
        Task<TeacherDto?> GetByIdAsync(int id);
        Task<bool> CreateAsync(CreateTeacherDto dto); // ✅ sửa chỗ này
        Task<bool> UpdateAsync(int id, TeacherDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
