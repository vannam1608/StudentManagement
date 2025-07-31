using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.Data;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Models;

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
            return await _context.Enrollments
                .Include(e => e.Student)
                    .ThenInclude(s => s.User)
                .Include(e => e.CourseClass)
                    .ThenInclude(cc => cc.Subject)
                .Include(e => e.CourseClass.Semester)
                .ToListAsync();
        }

        public async Task<Enrollment?> GetByIdAsync(int id)
        {
            return await _context.Enrollments
                .Include(e => e.Student)
                    .ThenInclude(s => s.User)
                .Include(e => e.CourseClass)
                    .ThenInclude(cc => cc.Subject)
                .Include(e => e.CourseClass.Semester)
                .FirstOrDefaultAsync(e => e.Id == id);
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
            return await _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .Include(e => e.Student)
                    .ThenInclude(s => s.User)
                .Include(e => e.CourseClass)
                    .ThenInclude(cc => cc.Subject)
                .Include(e => e.CourseClass.Semester)
                .ToListAsync();
        }

        public async Task<IEnumerable<Enrollment>> GetByCourseClassIdAsync(int courseClassId)
        {
            return await _context.Enrollments
                .Where(e => e.CourseClassId == courseClassId)
                .Include(e => e.Student)
                    .ThenInclude(s => s.User)
                .Include(e => e.CourseClass)
                    .ThenInclude(cc => cc.Subject)
                .Include(e => e.CourseClass.Semester)
                .ToListAsync();
        }

        public async Task<IEnumerable<Subject>> GetSubjectsByStudentIdAsync(int studentId)
        {
            var enrollments = await _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .Include(e => e.CourseClass)
                    .ThenInclude(cc => cc.Subject)
                .ToListAsync();

            var subjects = enrollments
                .Where(e => e.CourseClass?.Subject != null)
                .Select(e => e.CourseClass.Subject!)
                .Distinct()
                .ToList();

            return subjects;
        }

        public async Task<IEnumerable<Score>> GetScoresByStudentIdAsync(int studentId)
        {
            return await _context.Scores
                .Include(s => s.Enrollment)
                    .ThenInclude(e => e.Student)
                        .ThenInclude(s => s.User)
                .Include(s => s.Enrollment)
                    .ThenInclude(e => e.CourseClass)
                        .ThenInclude(cc => cc.Subject)
                .Where(s => s.Enrollment.StudentId == studentId)
                .ToListAsync();
        }

        public async Task<IEnumerable<CourseClass>> GetScheduleByStudentIdAsync(int studentId)
        {
            return await _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .Include(e => e.CourseClass)
                    .ThenInclude(cc => cc.Subject)
                .Include(e => e.CourseClass)
                    .ThenInclude(cc => cc.Semester)
                .Include(e => e.CourseClass)
                    .ThenInclude(cc => cc.Teacher)
                        .ThenInclude(t => t.User)
                .Select(e => e.CourseClass!)
                .Distinct()
                .ToListAsync();
        }
        public async Task<IEnumerable<Enrollment>> GetByStudentAndSemesterAsync(int studentId, int? semesterId)
        {
            var query = _context.Enrollments
                .Include(e => e.Student).ThenInclude(s => s.User)
                .Include(e => e.CourseClass).ThenInclude(c => c.Subject)
                .Include(e => e.CourseClass).ThenInclude(c => c.Semester)
                //.Include(e => e.CourseClass).ThenInclude(c => c.Schedule)
                .Where(e => e.StudentId == studentId);

            if (semesterId.HasValue)
            {
                query = query.Where(e => e.CourseClass.SemesterId == semesterId.Value);
            }

            return await query.ToListAsync();
        }


    }
}
