// Interfaces/Services/IUserService.cs
using StudentManagementAPI.DTOs.Common;
using StudentManagementAPI.DTOs.Student;
using StudentManagementAPI.DTOs.Subject;
using StudentManagementAPI.DTOs.Teacher;
using StudentManagementAPI.DTOs.User;
using StudentManagementAPI.Models.Common;


public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllAsync();
    Task<UserDto?> GetByIdAsync(int id);
    Task<bool> UpdateAsync(int id, UpdateUserDto dto);  // <- tên phải là UpdateAsync
    Task<IEnumerable<string>> GetRolesAsync(int userId);
    Task<bool> CreateAsync(CreateUserDto dto);
    Task<bool> DeleteAsync(int id);
    Task<bool> CreateTeacherAsync(CreateTeacherDto dto);
    Task<bool> CreateStudentAsync(CreateStudentDto dto);
    Task<IEnumerable<StudentDto>> GetAllStudentsAsync();

    Task<bool> RegisterSubjectForStudentAsync(int studentId, RegisterSubjectDto dto);
    Task<StudentDto?> GetStudentByIdAsync(int id);
    Task<bool> UpdateStudentAsync(int id, UpdateStudentDto dto);

    Task<IEnumerable<UserCredentialDto>> GetUserCredentialsAsync();
    Task<bool> ChangePasswordAsync(int userId, string newPassword);
    Task<bool> ChangeRoleAsync(int userId, string newRole);
    Task<bool> CancelEnrollmentAsync(int studentId, int enrollmentId);

    Task<PaginatedResult<UserDto>> GetPagedAsync(PaginationQueryDto query);

    Task<PaginatedResult<UserCredentialDto>> GetPagedCredentialsAsync(PaginationQueryDto query);


}
