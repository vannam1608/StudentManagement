using StudentManagementAPI.Models;

namespace StudentManagementAPI.Interfaces.Repositories
{
    public interface ICourseClassRepository : IBaseRepository<CourseClass>
    {
        Task<IEnumerable<CourseClass>> GetBySubjectAsync(int subjectId);
        Task<IEnumerable<CourseClass>> GetByTeacherIdAsync(int teacherId);
        Task CreateAsync(CourseClass entity);
        Task UpdateAsync(CourseClass entity);
        Task DeleteAsync(int id);
    }
}
