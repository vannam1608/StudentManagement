using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.Data;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Models;

namespace StudentManagementAPI.Repositories
{
    public class ScoreRepository : IScoreRepository
    {
        private readonly AppDbContext _context;

        public ScoreRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Score>> GetAllAsync()
        {
            return await _context.Scores
                .Include(s => s.Enrollment)
                    .ThenInclude(e => e.Student)
                        .ThenInclude(s => s.User)
                .Include(s => s.Enrollment.CourseClass)
                    .ThenInclude(c => c.Subject)
                .ToListAsync();
        }

        public async Task<Score?> GetByIdAsync(int id)
        {
            return await _context.Scores
                .Include(s => s.Enrollment)
                    .ThenInclude(e => e.Student)
                        .ThenInclude(s => s.User)
                .Include(s => s.Enrollment.CourseClass)
                    .ThenInclude(c => c.Subject)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Score?> GetByEnrollmentIdAsync(int enrollmentId)
        {
            return await _context.Scores
                .Include(s => s.Enrollment)
                    .ThenInclude(e => e.Student)
                        .ThenInclude(s => s.User)
                .Include(s => s.Enrollment.CourseClass)
                    .ThenInclude(c => c.Subject)
                .FirstOrDefaultAsync(s => s.EnrollmentId == enrollmentId);
        }

        public async Task<Score?> GetByStudentAndSubjectAsync(int studentId, int subjectId)
        {
            return await _context.Scores
                .Include(s => s.Enrollment)
                    .ThenInclude(e => e.Student)
                        .ThenInclude(s => s.User)
                .Include(s => s.Enrollment.CourseClass)
                    .ThenInclude(c => c.Subject)
                .FirstOrDefaultAsync(s =>
                    s.Enrollment.StudentId == studentId &&
                    s.Enrollment.CourseClass.SubjectId == subjectId);
        }

        public async Task<IEnumerable<Score>> GetByStudentIdAsync(int studentId)
        {
            return await _context.Scores
                .Include(s => s.Enrollment)
                    .ThenInclude(e => e.Student)
                        .ThenInclude(s => s.User)
                .Include(s => s.Enrollment.CourseClass)
                    .ThenInclude(c => c.Subject)
                .Where(s => s.Enrollment.StudentId == studentId)
                .ToListAsync();
        }

        public async Task AddAsync(Score score)
        {
            await _context.Scores.AddAsync(score);
        }

        public void Update(Score score)
        {
            _context.Scores.Update(score);
        }

        public void Delete(Score score)
        {
            _context.Scores.Remove(score);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Score>> GetByTeacherIdAsync(int teacherId)
        {
            return await _context.Scores
                .Include(s => s.Enrollment)
                    .ThenInclude(e => e.Student)
                        .ThenInclude(st => st.User) 

                .Include(s => s.Enrollment)
                    .ThenInclude(e => e.CourseClass)
                        .ThenInclude(c => c.Subject)
                .Where(s => s.Enrollment.CourseClass.TeacherId == teacherId)
                .ToListAsync();
        }

        public async Task<(IEnumerable<Score> Scores, int TotalItems)> GetPagedAsync(int page, int pageSize, string? studentCode, string? classCode)
        {
            var query = _context.Scores
                .Include(s => s.Enrollment)
                    .ThenInclude(e => e.Student)
                        .ThenInclude(u => u.User)
                .Include(s => s.Enrollment.CourseClass)
                    .ThenInclude(cc => cc.Subject)
                .AsQueryable();

            if (!string.IsNullOrEmpty(studentCode))
            {
                query = query.Where(s => s.Enrollment.Student.StudentCode.Contains(studentCode));
            }

            if (!string.IsNullOrEmpty(classCode))
            {
                query = query.Where(s => s.Enrollment.CourseClass.ClassCode.Contains(classCode));
            }

            int totalItems = await query.CountAsync();

            var scores = await query
                .OrderBy(s => s.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (scores, totalItems);
        }



    }




}
