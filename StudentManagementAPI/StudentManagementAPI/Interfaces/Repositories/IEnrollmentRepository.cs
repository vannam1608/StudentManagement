using StudentManagementAPI.DTOs.Subject;
using StudentManagementAPI.Models;

using StudentManagementAPI.Models;

public interface IEnrollmentRepository
{
    Task<IEnumerable<Enrollment>> GetAllAsync();
    Task<Enrollment?> GetByIdAsync(int id);

    Task<IEnumerable<Enrollment>> GetByStudentIdAsync(int studentId);
    Task<IEnumerable<Enrollment>> GetByCourseClassIdAsync(int courseClassId);

    Task<IEnumerable<SubjectDto>> GetSubjectsByStudentIdAsync(int studentId);
    Task<IEnumerable<Score>> GetScoresByStudentIdAsync(int studentId);
    Task<IEnumerable<CourseClass>> GetScheduleByStudentIdAsync(int studentId);

    // ✅ Tìm kiếm chung (có thể lọc theo studentId, semesterId, studentCode, subjectName)
    Task<IEnumerable<Enrollment>> SearchAsync(
    int? studentId,
    int? semesterId,
    string? studentCode,
    string? subjectName);


    Task AddAsync(Enrollment enrollment);
    void Update(Enrollment enrollment);
    void Delete(Enrollment enrollment);
    Task SaveChangesAsync();

    IQueryable<Enrollment> Query();
}

