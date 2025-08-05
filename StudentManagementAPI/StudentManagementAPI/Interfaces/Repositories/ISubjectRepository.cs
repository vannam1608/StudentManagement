using StudentManagementAPI.DTOs.Subject;
using StudentManagementAPI.Models;

public interface ISubjectRepository
{
    Task<bool> CreateAsync(Subject subject);
    Task<IEnumerable<Subject>> GetAllAsync();
    Task<Subject?> GetByIdAsync(int id);
    Task<bool> UpdateAsync(Subject subject);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<Subject>> GetBySemesterAsync(int semesterId);
    Task<IQueryable<Subject>> GetQueryableAsync();
    Task<(IEnumerable<SubjectDto> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? keyword, int? semesterId);


    Task<IEnumerable<CourseClass>> GetCourseClassesOfOpenSemester();
    Task<IEnumerable<CourseClass>> GetCourseClassesBySemesterAsync(int semesterId);

    void Update(Subject entity);
    void Delete(Subject entity);
    Task AddAsync(Subject entity);
    Task SaveChangesAsync();
}
