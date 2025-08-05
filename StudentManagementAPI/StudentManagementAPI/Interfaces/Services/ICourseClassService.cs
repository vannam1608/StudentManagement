using StudentManagementAPI.DTOs.Common;
using StudentManagementAPI.DTOs.CourseClass;
using StudentManagementAPI.Models.Common;

namespace StudentManagementAPI.Interfaces.Services
{
    public interface ICourseClassService
    {
        Task<IEnumerable<CourseClassDto>> GetAllAsync();


        Task<CourseClassDto?> GetByIdAsync(int id);

        Task<bool> CreateAsync(CreateCourseClassDto dto);

        Task<bool> UpdateAsync(int id, CreateCourseClassDto dto);

        Task<bool> DeleteAsync(int id);

   
        Task<IEnumerable<CourseClassDto>> GetBySubjectIdAsync(int subjectId);


        Task<IEnumerable<CourseClassDto>> GetByTeacherIdAsync(int teacherId);

        Task<PaginatedResult<CourseClassDto>> GetPagedAsync(PaginationQueryDto paginationDto);
    }
}
