using StudentManagementAPI.DTOs.Common;
using StudentManagementAPI.DTOs.Enrollment;
using StudentManagementAPI.Models.Common;

namespace StudentManagementAPI.Interfaces.Services
{
    public interface IEnrollmentService
    {
        Task<IEnumerable<EnrollmentDto>> GetAllAsync();
        Task<EnrollmentDto?> GetByIdAsync(int id);
        Task<int> CreateAsync(CreateEnrollmentDto dto);
        Task<bool> UpdateAsync(int id, CreateEnrollmentDto dto);
        Task<bool> DeleteAsync(int id);

        // ✅ Tìm kiếm/lọc danh sách đăng ký (gộp các method cũ)
        Task<PaginatedResult<EnrollmentDto>> SearchAsync(
        int? studentId = null,
        int? semesterId = null,
        string? studentCode = null,
        string? subjectName = null,
        int page = 1,
        int pageSize = 10
);


        // ✅ Lấy danh sách đăng ký có phân trang
        Task<PaginatedResult<EnrollmentDto>> GetPagedAsync(PaginationQueryDto query);
    }
}
