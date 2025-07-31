using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.Data;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Models;

namespace StudentManagementAPI.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly AppDbContext _context;

        public StudentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Student>> GetAllAsync()
        {
            return await _context.Students
                .Include(s => s.User)
                .Include(s => s.Department)
                .Include(s => s.Program)
                .ToListAsync();
        }

        public async Task<Student?> GetByIdAsync(int id)
        {
            return await _context.Students
                .Include(s => s.User)
                .Include(s => s.Department)
                .Include(s => s.Program)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<bool> CreateAsync(Student student)
        {
            _context.Students.Add(student);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateAsync(Student student)
        {
            _context.Students.Update(student);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return false;

            _context.Students.Remove(student);
            return await _context.SaveChangesAsync() > 0;
        }


    }
}
