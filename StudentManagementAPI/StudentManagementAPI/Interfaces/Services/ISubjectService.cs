using StudentManagementAPI.DTOs.Subject;
using StudentManagementAPI.Models.Common;

public interface ISubjectService
{
    Task<IEnumerable<SubjectDto>> GetAllAsync();
    Task<SubjectDto?> GetByIdAsync(int id);
    Task<bool> CreateAsync(SubjectDto dto);
    Task<bool> UpdateAsync(int id, SubjectDto dto);
    Task<bool> DeleteAsync(int id);

    // ✅ THÊM MỚI:
    Task<IEnumerable<SubjectDto>> SearchByNameAsync(string name);
    Task<IEnumerable<SubjectDto>> GetAvailableSubjectsAsync();
    Task<IEnumerable<SubjectDto>> GetAvailableSubjectsBySemesterAsync(int semesterId);


    Task<PaginatedResult<SubjectDto>> GetPagedAsync(int page, int pageSize, string? keyword = null, int? semesterId = null); 


}
