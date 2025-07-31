using StudentManagementAPI.Models;

public interface ISubjectRepository
{
    Task<IEnumerable<Subject>> GetAllAsync();
    Task<Subject?> GetByIdAsync(int id);
    Task<bool> CreateAsync(Subject subject);
    Task<bool> UpdateAsync(Subject subject);
    Task<bool> DeleteAsync(int id);

    // ✅ THÊM MỚI:
    Task<IEnumerable<CourseClass>> GetCourseClassesOfOpenSemester();

    Task<IEnumerable<CourseClass>> GetCourseClassesBySemesterAsync(int semesterId);

}
