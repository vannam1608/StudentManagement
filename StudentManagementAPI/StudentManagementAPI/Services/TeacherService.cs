using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.Data;
using StudentManagementAPI.DTOs.Teacher;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Models;

namespace StudentManagementAPI.Services
{
    public class TeacherService : ITeacherService
    {
        private readonly ITeacherRepository _repo;
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;

        public TeacherService(ITeacherRepository repo, IMapper mapper, AppDbContext context)
        {
            _repo = repo;
            _mapper = mapper;
            _context = context;
        }

        // ✅ Danh sách giảng viên
        public async Task<IEnumerable<TeacherDto>> GetAllAsync()
        {
            var users = await _context.Users
                .Where(u => u.Role == "Teacher")
                .ToListAsync();

            var teachers = await _context.Teachers.ToDictionaryAsync(t => t.Id);

            var result = users.Select(user =>
            {
                teachers.TryGetValue(user.Id, out var teacher);

                return new TeacherDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    FullName = user.FullName,
                    Email = user.Email,
                    Phone = user.Phone,
                    TeacherCode = teacher?.TeacherCode ?? "", // Nếu không có thì rỗng
                    Degree = teacher?.Degree ?? "",
                };
            });

            return result;
        }


        // ✅ Thông tin giảng viên theo Id
        public async Task<TeacherDto?> GetByIdAsync(int id)
        {
            var teacher = await _repo.GetByIdAsync(id);
            return teacher == null ? null : _mapper.Map<TeacherDto>(teacher);
        }

        // ✅ Thêm mới User + Teacher
        public async Task<bool> CreateAsync(CreateTeacherDto dto)
        {
            // Kiểm tra trùng Username hoặc mã giảng viên
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username) ||
                await _context.Teachers.AnyAsync(t => t.TeacherCode == dto.TeacherCode))
            {
                return false;
            }

            // 1. Tạo User
            var user = new User
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password ?? "123456"),
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                Role = "Teacher"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync(); // Để có User.Id

            // 2. Tạo Teacher (Id = User.Id)
            var teacher = new Teacher
            {
                Id = user.Id,
                TeacherCode = dto.TeacherCode,
                Degree = dto.Degree
            };

            _context.Teachers.Add(teacher);
            return await _context.SaveChangesAsync() > 0;
        }

        // ✅ Cập nhật thông tin User + Teacher
        public async Task<bool> UpdateAsync(int id, TeacherDto dto)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            var user = await _context.Users.FindAsync(id);

            if (teacher == null || user == null || user.Role != "Teacher")
                return false;

            // Cập nhật User
            user.FullName = dto.FullName;
            user.Email = dto.Email;
            user.Phone = dto.Phone;

            // ❗ CHỈ cập nhật TeacherCode nếu không rỗng
            if (!string.IsNullOrWhiteSpace(dto.TeacherCode))
            {
                teacher.TeacherCode = dto.TeacherCode;
            }

            teacher.Degree = dto.Degree;

            return await _context.SaveChangesAsync() > 0;
        }


        // ✅ Xoá giảng viên (xoá User => cascade Teacher)
        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null || user.Role != "Teacher") return false;

            _context.Users.Remove(user); // Teacher sẽ tự xoá nhờ FK
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
