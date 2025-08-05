using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Models;
using StudentManagementAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace StudentManagementAPI.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task AddAsync(User entity)
        {
            await _context.Users.AddAsync(entity);
        }

        public void Update(User entity)
        {
            _context.Users.Update(entity);
        }

        public void Delete(User entity) // ✅ BỔ SUNG METHOD NÀY
        {
            _context.Users.Remove(entity);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<bool> IsUsernameTakenAsync(string username)
        {
            return await _context.Users.AnyAsync(u => u.Username == username);
        }

        public async Task<bool> UpdateAsync(User user)
        {
            _context.Users.Update(user);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public Task AddTeacherAsync(Teacher teacher)
        {
            _context.Teachers.Add(teacher);
            return Task.CompletedTask;
        }

        public async Task<(List<User>, int)> GetPagedAsync(int page, int pageSize)
        {
            var query = _context.Users.AsQueryable();

            var totalItems = await query.CountAsync();
            var users = await query
                .OrderBy(u => u.Id) 
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (users, totalItems);
        }


    }
}
