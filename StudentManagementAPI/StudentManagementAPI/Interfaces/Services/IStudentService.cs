using StudentManagementAPI.DTOs.Enrollment;
using StudentManagementAPI.DTOs.Schedule;
using StudentManagementAPI.DTOs.Score;
using StudentManagementAPI.DTOs.Student;
using StudentManagementAPI.DTOs.Subject;
using StudentManagementAPI.Models.Common;

public interface IStudentService
{
    Task<IEnumerable<StudentDto>> GetAllAsync();
    Task<StudentDto?> GetByIdAsync(int id);
    Task<bool> CreateAsync(CreateStudentDto dto);
    Task<bool> UpdateAsync(int id, UpdateStudentDto dto);
    Task<bool> DeleteAsync(int id);

    // Các hàm cho sinh viên sử dụng
    Task<IEnumerable<EnrollmentDto>> GetEnrollmentsAsync(int studentId);
    Task<IEnumerable<SubjectDto>> GetRegisteredSubjectsAsync(int studentId);
    Task<IEnumerable<ScheduleDto>> GetScheduleAsync(int studentId);
    Task<IEnumerable<ScoreDto>> GetScoresAsync(int studentId);
    Task<bool> RegisterSubjectAsync(int studentId, RegisterSubjectDto dto);

    // ✅ CHỈNH HÀM NÀY THÊM THAM SỐ TÌM KIẾM
    Task<PaginatedResult<StudentDto>> GetPagedAsync(int page, int pageSize, string? studentCode = null);
}
