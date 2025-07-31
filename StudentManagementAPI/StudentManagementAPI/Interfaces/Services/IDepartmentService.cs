using StudentManagementAPI.DTOs.Department;

public interface IDepartmentService
{
    Task<IEnumerable<DepartmentDto>> GetAllAsync();
    Task<DepartmentDto?> GetByIdAsync(int id);
    Task<bool> CreateAsync(CreateDepartmentDto dto);
    Task<bool> UpdateAsync(int id, CreateDepartmentDto dto);
    Task<bool> DeleteAsync(int id);
}
