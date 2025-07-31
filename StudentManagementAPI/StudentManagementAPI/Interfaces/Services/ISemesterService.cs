using StudentManagementAPI.DTOs.Semester;

namespace StudentManagementAPI.Interfaces.Services
{
    public interface ISemesterService
    {
        Task<IEnumerable<SemesterDto>> GetAllAsync();
        Task<SemesterDto?> GetByIdAsync(int id);
        Task<bool> CreateAsync(CreateSemesterDto dto);
        Task<bool> UpdateAsync(int id, CreateSemesterDto dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> ToggleAsync(int id);
    }
}
