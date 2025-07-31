using StudentManagementAPI.Models;

public interface IDepartmentRepository
{
    Task<IEnumerable<Department>> GetAllAsync();
    Task<Department?> GetByIdAsync(int id);
    Task CreateAsync(Department department);
    Task UpdateAsync(Department department);
    Task DeleteAsync(Department department);
}
