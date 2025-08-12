using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.Data;
using StudentManagementAPI.DTOs.Subject;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Models;
using System.Runtime.CompilerServices;

namespace StudentManagementAPI.Repositories
{
    public class EnrollmentRepository : IEnrollmentRepository
    {
        private readonly AppDbContext _context;

        public EnrollmentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Enrollment>> GetAllAsync()
        {
            return await Query().ToListAsync();
        }

        public async Task<Enrollment?> GetByIdAsync(int id)
        {
            return await Query().FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task AddAsync(Enrollment entity)
        {
            await _context.Enrollments.AddAsync(entity);
        }

        public void Update(Enrollment entity)
        {
            _context.Enrollments.Update(entity);
        }

        public void Delete(Enrollment entity)
        {
            _context.Enrollments.Remove(entity);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Enrollment>> GetByStudentIdAsync(int studentId)
        {
            return await Query()
                .Where(e => e.StudentId == studentId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Enrollment>> GetByCourseClassIdAsync(int courseClassId)
        {
            return await Query()
                .Where(e => e.CourseClassId == courseClassId)
                .ToListAsync();
        }

        public async Task<IEnumerable<SubjectDto>> GetSubjectsByStudentIdAsync(int studentId)
        {
            string sql = @$"
SELECT DISTINCT
    s.Id, s.SubjectCode, s.Name, s.Description, s.Credit,
    sem.Id AS SemesterId, sem.Name AS SemesterName
FROM Enrollments e
JOIN CourseClasses cc ON e.CourseClassId = cc.Id
JOIN Subjects s ON cc.SubjectId = s.Id
JOIN Semesters sem ON cc.SemesterId = sem.Id
WHERE e.StudentId = {studentId}"; 

            var subjects = await _context.Set<SubjectDto>()
                .FromSqlInterpolated(FormattableStringFactory.Create(sql, studentId))
                .ToListAsync();


            return subjects;
        }








        public async Task<IEnumerable<Score>> GetScoresByStudentIdAsync(int studentId)
        {
            return await _context.Scores
                .Include(s => s.Enrollment).ThenInclude(e => e.Student).ThenInclude(s => s.User)
                .Include(s => s.Enrollment).ThenInclude(e => e.CourseClass).ThenInclude(cc => cc.Subject)
                .Where(s => s.Enrollment.StudentId == studentId && s.Enrollment.CourseClass.Semester.IsOpen)
                .ToListAsync();
        }

        public async Task<IEnumerable<CourseClass>> GetScheduleByStudentIdAsync(int studentId)
        {
            return await _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .Include(e => e.CourseClass).ThenInclude(cc => cc.Subject)
                .Include(e => e.CourseClass).ThenInclude(cc => cc.Semester)
                .Include(e => e.CourseClass).ThenInclude(cc => cc.Teacher).ThenInclude(t => t.User)
                .Select(e => e.CourseClass!)
                .Distinct()
                .ToListAsync();
        }


        public IQueryable<Enrollment> Query()
        {
            return _context.Enrollments
                .Include(e => e.Student).ThenInclude(s => s.User)
                .Include(e => e.CourseClass).ThenInclude(c => c.Subject)
                .Include(e => e.CourseClass).ThenInclude(c => c.Semester);
        }

        // ✅ Method tìm kiếm chung, thay thế cho GetByStudentAndSemester & GetBySemester
        public async Task<IEnumerable<Enrollment>> SearchAsync(
            int? studentId,
            int? semesterId,
            string? studentCode,
            string? subjectName)
        {
            var query = Query();

            if (studentId.HasValue)
                query = query.Where(e => e.StudentId == studentId.Value);

            if (semesterId.HasValue)
                query = query.Where(e => e.CourseClass.SemesterId == semesterId.Value);

            if (!string.IsNullOrEmpty(studentCode))
                query = query.Where(e => e.Student.StudentCode.ToLower().Contains(studentCode.ToLower()));

            if (!string.IsNullOrEmpty(subjectName))
                query = query.Where(e => e.CourseClass.Subject.Name.ToLower().Contains(subjectName.ToLower()));

            return await query.ToListAsync();
        }
    }
}
