using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.Data;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Models;

namespace StudentManagementAPI.Repositories
{
    public class SemesterRepository : ISemesterRepository
    {
        private readonly AppDbContext _context;

        public SemesterRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<Semester> Query()
        {
            return _context.Semesters.AsQueryable();
        }

        public async Task<IEnumerable<Semester>> GetAllAsync()
        {
            return await _context.Semesters
                .OrderByDescending(s => s.StartDate)
                .ToListAsync();
        }

        public async Task<Semester?> GetByIdAsync(int id)
        {
            return await _context.Semesters.FindAsync(id);
        }

        public async Task AddAsync(Semester semester)
        {
            await _context.Semesters.AddAsync(semester);
        }

        public void Update(Semester semester)
        {
            _context.Semesters.Update(semester);
        }

        public void Remove(Semester semester)
        {
            _context.Semesters.Remove(semester);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
