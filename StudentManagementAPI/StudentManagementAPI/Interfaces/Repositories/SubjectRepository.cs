using StudentManagementAPI.Models;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace StudentManagementAPI.Repositories
{
    public class SubjectRepository : ISubjectRepository
    {
        private readonly AppDbContext _context;

        public SubjectRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CreateAsync(Subject subject)
        {
            await _context.Subjects.AddAsync(subject);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null)
                return false;

            _context.Subjects.Remove(subject);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<IEnumerable<Subject>> GetAllAsync()
        {
            return await _context.Subjects.ToListAsync();
        }

        public async Task<Subject?> GetByIdAsync(int id)
        {
            return await _context.Subjects.FindAsync(id);
        }

        // ✅ Loại bỏ vì Subject không có SemesterId
        public Task<IEnumerable<Subject>> GetBySemesterAsync(int semesterId)
        {
            return Task.FromResult(Enumerable.Empty<Subject>());
        }

        public async Task<bool> UpdateAsync(Subject subject)
        {
            var existingSubject = await _context.Subjects.FindAsync(subject.Id);
            if (existingSubject == null)
                return false;

            // Cập nhật đúng các trường có trong DB
            existingSubject.Name = subject.Name;
            existingSubject.Credit = subject.Credit;
            existingSubject.Description = subject.Description;
            existingSubject.SubjectCode = subject.SubjectCode;

            _context.Subjects.Update(existingSubject);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        // IBaseRepository methods
        public void Update(Subject entity)
        {
            _context.Subjects.Update(entity);
        }

        public void Delete(Subject entity)
        {
            _context.Subjects.Remove(entity);
        }

        public async Task AddAsync(Subject entity)
        {
            await _context.Subjects.AddAsync(entity);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
        // ✅ Trả về danh sách lớp học phần thuộc học kỳ đang mở
        public async Task<IEnumerable<CourseClass>> GetCourseClassesOfOpenSemester()
        {
            return await _context.CourseClasses
                .Include(cc => cc.Subject)
                .Include(cc => cc.Semester)
                .Where(cc => cc.Semester.IsOpen)
                .ToListAsync();
        }
        public async Task<IEnumerable<CourseClass>> GetCourseClassesBySemesterAsync(int semesterId)
        {
            return await _context.CourseClasses
                .Include(c => c.Subject)
                .Where(c => c.SemesterId == semesterId)
                .ToListAsync();
        }

    }
}
