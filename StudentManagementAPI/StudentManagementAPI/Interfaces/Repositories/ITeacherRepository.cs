using StudentManagementAPI.Models;

namespace StudentManagementAPI.Interfaces.Repositories
{
    public interface ITeacherRepository
    {
        Task<IEnumerable<Teacher>> GetAllAsync();
        Task<Teacher?> GetByIdAsync(int id);
        Task<bool> CreateAsync(Teacher teacher);
        Task<bool> UpdateAsync(Teacher teacher);
        Task<bool> DeleteAsync(int id);

        Task<IQueryable<Teacher>> GetQueryableAsync();
    }

}
