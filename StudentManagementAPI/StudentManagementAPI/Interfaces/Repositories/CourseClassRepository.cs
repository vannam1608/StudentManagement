using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.Data;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentManagementAPI.Repositories
{
    public class CourseClassRepository : ICourseClassRepository
    {
        private readonly AppDbContext _context;

        public CourseClassRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CourseClass>> GetAllAsync()
        {
            return await _context.CourseClasses
                .Include(c => c.Subject)
                .Include(c => c.Teacher).ThenInclude(t => t.User)
                .Include(c => c.Semester)
                .Include(c => c.Enrollments)
                .ToListAsync();
        }


        public async Task<CourseClass?> GetByIdAsync(int id)
        {
            return await _context.CourseClasses
                .Include(c => c.Subject)
                .Include(c => c.Teacher).ThenInclude(t => t.User)
                .Include(c => c.Semester)
                .Include(c => c.Enrollments)
                .FirstOrDefaultAsync(c => c.Id == id);
        }


        public async Task AddAsync(CourseClass entity)
        {
            await _context.CourseClasses.AddAsync(entity);
        }

        public void Update(CourseClass entity)
        {
            _context.CourseClasses.Update(entity);
        }

        public void Delete(CourseClass entity)
        {
            _context.CourseClasses.Remove(entity);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<CourseClass>> GetBySubjectAsync(int subjectId)
        {
            return await _context.CourseClasses
                .Where(c => c.SubjectId == subjectId)
                .Include(c => c.Subject)
                .Include(c => c.Teacher).ThenInclude(t => t.User)
                .Include(c => c.Semester)
                .Include(c => c.Enrollments)
                .ToListAsync();
        }


        public async Task<IEnumerable<CourseClass>> GetByTeacherIdAsync(int teacherId)
        {
            return await _context.CourseClasses
                .Where(c => c.TeacherId == teacherId)
                .Include(c => c.Subject)
                .Include(c => c.Teacher).ThenInclude(t => t.User)
                .Include(c => c.Semester)
                .Include(c => c.Enrollments)
                .ToListAsync();
        }


        public async Task CreateAsync(CourseClass entity)
        {
            await AddAsync(entity);
            await SaveChangesAsync();
        }

        public async Task UpdateAsync(CourseClass entity)
        {
            Update(entity);
            await SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var course = await GetByIdAsync(id);
            if (course != null)
            {
                Delete(course);
                await SaveChangesAsync();
            }
        }


        public async Task<int> CountAsync()
        {
            return await _context.CourseClasses.CountAsync();
        }

        public async Task<IEnumerable<CourseClass>> GetPagedAsync(int page, int pageSize)
        {
            return await _context.CourseClasses
                .Include(c => c.Subject)
                .Include(c => c.Teacher).ThenInclude(t => t.User)
                .Include(c => c.Semester)
                .Include(c => c.Enrollments)
                .OrderBy(c => c.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }


    }
}
