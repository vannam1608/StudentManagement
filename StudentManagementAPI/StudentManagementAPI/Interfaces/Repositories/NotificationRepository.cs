using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.Data;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentManagementAPI.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly AppDbContext _context;

        public NotificationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Notification>> GetAllAsync()
        {
            return await _context.Notifications
                .Include(n => n.Creator)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        public async Task<Notification?> GetByIdAsync(int id)
        {
            return await _context.Notifications
                .Include(n => n.Creator)
                .FirstOrDefaultAsync(n => n.Id == id);
        }

        public async Task AddAsync(Notification entity)
        {
            await _context.Notifications.AddAsync(entity);
        }

        public void Update(Notification entity)
        {
            _context.Notifications.Update(entity);
        }

        public void Delete(Notification entity)
        {
            _context.Notifications.Remove(entity);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Notification>> GetByTargetRoleAsync(string role)
        {
            return await _context.Notifications
                .Where(n => n.TargetRole == "All" || n.TargetRole == role)
                .OrderByDescending(n => n.CreatedAt)
                .Include(n => n.Creator)
                .ToListAsync();
        }

        public async Task<IEnumerable<Notification>> GetLatestAsync(int count = 10)
        {
            return await _context.Notifications
                .OrderByDescending(n => n.CreatedAt)
                .Take(count)
                .Include(n => n.Creator)
                .ToListAsync();
        }

        // ✅ THÊM MỚI - lấy theo userId
        public async Task<IEnumerable<Notification>> GetByUserIdAsync(int userId)
        {
            return await _context.Notifications
                .Where(n => n.CreatedBy == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Include(n => n.Creator)
                .ToListAsync();
        }

        // ✅ THÊM MỚI - lấy tất cả 
        public async Task<IEnumerable<Notification>> GetAllByRoleAsync(string role)
        {
            return await _context.Notifications
                .Where(n => n.TargetRole == "All" || n.TargetRole == role)
                .OrderByDescending(n => n.CreatedAt)
                .Include(n => n.Creator)
                .ToListAsync();
        }



        // ✅ THÊM MỚI - thêm mới notification
        public async Task CreateAsync(Notification newNotification)
        {
            await _context.Notifications.AddAsync(newNotification);
            await _context.SaveChangesAsync();
        }
    }
}
