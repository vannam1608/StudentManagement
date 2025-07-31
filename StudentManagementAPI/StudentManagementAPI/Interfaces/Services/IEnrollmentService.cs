using StudentManagementAPI.DTOs.Enrollment;

namespace StudentManagementAPI.Interfaces.Services
{
    public interface IEnrollmentService
    {
        Task<IEnumerable<EnrollmentDto>> GetAllAsync();
        Task<EnrollmentDto?> GetByIdAsync(int id);
        Task<int> CreateAsync(CreateEnrollmentDto dto);
        Task<bool> UpdateAsync(int id, CreateEnrollmentDto dto);
        Task<bool> DeleteAsync(int id);

        // ✅ Cho phép lọc theo studentId (bắt buộc) và semesterId (tùy chọn)
        Task<IEnumerable<EnrollmentDto>> GetByStudentAndSemesterAsync(int studentId, int? semesterId);
    }
}
