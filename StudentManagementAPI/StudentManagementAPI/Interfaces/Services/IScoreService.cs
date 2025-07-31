using StudentManagementAPI.DTOs.Score;
using StudentManagementAPI.Models.Common;

namespace StudentManagementAPI.Interfaces.Services
{
    public interface IScoreService
    {
        Task<IEnumerable<ScoreDto>> GetAllAsync();
        Task<ScoreDto?> GetByEnrollmentIdAsync(int enrollmentId);
        Task<IEnumerable<ScoreDto>> GetByStudentIdAsync(int studentId);
        Task<ScoreDto?> GetByStudentAndSubjectAsync(int studentId, int subjectId);
        Task<bool> InputScoreAsync(InputScoreDto dto);
        Task<int> CreateMissingScoresAsync();

        Task<IEnumerable<ScoreDto>> GetScoresByTeacherIdAsync(int teacherId);
        Task<PaginatedResult<ScoreDto>> GetPagedAsync(int page, int pageSize, string? studentCode, string? classCode);


    }
}
