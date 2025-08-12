using StudentManagementAPI.Models;

namespace StudentManagementAPI.Interfaces.Repositories
{
    public interface ISemesterRepository
    {
        IQueryable<Semester> Query();
        Task<IEnumerable<Semester>> GetAllAsync();
        Task<Semester?> GetByIdAsync(int id);
        Task AddAsync(Semester semester);
        void Update(Semester semester);
        void Remove(Semester semester);
        Task SaveChangesAsync();
    }
}
