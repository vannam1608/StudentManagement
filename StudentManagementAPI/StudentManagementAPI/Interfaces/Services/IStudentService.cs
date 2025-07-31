// Interfaces/Services/IStudentService.cs
using StudentManagementAPI.DTOs.Student;
using StudentManagementAPI.DTOs.Enrollment;
using StudentManagementAPI.DTOs.Schedule;
using StudentManagementAPI.DTOs.Score;
using StudentManagementAPI.DTOs.Subject;

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

}
