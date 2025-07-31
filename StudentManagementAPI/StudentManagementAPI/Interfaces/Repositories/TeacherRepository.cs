using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.Data;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Models;

namespace StudentManagementAPI.Repositories
{
    public class TeacherRepository : ITeacherRepository
    {
        private readonly AppDbContext _context;

        public TeacherRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Teacher>> GetAllAsync()
        {
            return await _context.Teachers.Include(t => t.User).ToListAsync();
        }

        public async Task<Teacher?> GetByIdAsync(int id)
        {
            return await _context.Teachers.Include(t => t.User).FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<bool> CreateAsync(Teacher teacher)
        {
            _context.Teachers.Add(teacher);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateAsync(Teacher teacher)
        {
            _context.Teachers.Update(teacher);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return false;
            _context.Teachers.Remove(teacher);
            return await _context.SaveChangesAsync() > 0;
        }
    }

}
