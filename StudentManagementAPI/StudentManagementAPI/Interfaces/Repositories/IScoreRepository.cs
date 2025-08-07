using StudentManagementAPI.Models;

namespace StudentManagementAPI.Interfaces.Repositories
{
    public interface IScoreRepository : IBaseRepository<Score>
    {
        Task<IEnumerable<Score>> GetByStudentIdAsync(int studentId);
        Task<Score?> GetByEnrollmentIdAsync(int enrollmentId);
        Task<Score?> GetByStudentAndSubjectAsync(int studentId, int subjectId);

        Task<IEnumerable<Score>> GetByTeacherIdAsync(int teacherId);

        Task<(IEnumerable<Score> Scores, int TotalItems)> GetPagedAsync(int page, int pageSize, string? studentCode, string? classCode);


        Task<IEnumerable<Score>> GetWithSemesterByStudentIdAsync(int studentId);



    }
}
