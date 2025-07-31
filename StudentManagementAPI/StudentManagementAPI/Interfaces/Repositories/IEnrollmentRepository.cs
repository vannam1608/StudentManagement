using StudentManagementAPI.Models;

public interface IEnrollmentRepository
{
    Task<IEnumerable<Enrollment>> GetAllAsync();
    Task<Enrollment?> GetByIdAsync(int id);

    Task<IEnumerable<Enrollment>> GetByStudentIdAsync(int studentId);
    Task<IEnumerable<Enrollment>> GetByCourseClassIdAsync(int courseClassId);

    Task<IEnumerable<Subject>> GetSubjectsByStudentIdAsync(int studentId);
    Task<IEnumerable<Score>> GetScoresByStudentIdAsync(int studentId);
    Task<IEnumerable<CourseClass>> GetScheduleByStudentIdAsync(int studentId);

    Task<IEnumerable<Enrollment>> GetByStudentAndSemesterAsync(int studentId, int? semesterId); // ✅ Đã chỉnh sửa

    Task AddAsync(Enrollment enrollment);
    void Update(Enrollment enrollment);
    void Delete(Enrollment enrollment);
    Task SaveChangesAsync();
}
