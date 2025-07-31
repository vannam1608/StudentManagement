using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.Data;
using StudentManagementAPI.DTOs.Student;
using StudentManagementAPI.DTOs.Subject;
using StudentManagementAPI.DTOs.Teacher;
using StudentManagementAPI.DTOs.User;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Models;

namespace StudentManagementAPI.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IStudentRepository _studentRepository; // ✅ Thêm dòng này
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;
        private readonly IStudentService _studentService;

        public UserService(
            IUserRepository userRepository,
            IStudentRepository studentRepository, // ✅ Thêm vào constructor
            IMapper mapper,
            AppDbContext context,
            IStudentService studentService)
        {
            _userRepository = userRepository;
            _studentRepository = studentRepository; // ✅ Gán lại
            _mapper = mapper;
            _context = context;
            _studentService = studentService;
        }

        // ✅ Lấy tất cả người dùng
        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        // ✅ Lấy người dùng theo ID
        public async Task<UserDto?> GetByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            return user == null ? null : _mapper.Map<UserDto>(user);
        }

        // ✅ Tạo người dùng mới
        public async Task<bool> CreateAsync(CreateUserDto dto)
        {
            var existing = await _userRepository.GetByUsernameAsync(dto.Username);
            if (existing != null) return false;

            var user = new User
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                Role = dto.Role
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();
            return true;
        }

        // ✅ Tạo sinh viên (User + Student)
        public async Task<bool> CreateStudentAsync(CreateStudentDto dto)
        {
            var existing = await _userRepository.GetByUsernameAsync(dto.Username);
            if (existing != null) return false;

            var user = new User
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                Role = "Student"
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            var student = new Student
            {
                Id = user.Id,
                StudentCode = dto.StudentCode,
                DateOfBirth = dto.DateOfBirth,
                Gender = dto.Gender,
                DepartmentId = dto.DepartmentId,
                ProgramId = dto.ProgramId
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return true;
        }

        // ✅ Tạo giảng viên (User + Teacher)
        public async Task<bool> CreateTeacherAsync(CreateTeacherDto dto)
        {
            var existing = await _userRepository.GetByUsernameAsync(dto.Username);
            if (existing != null) return false;

            var user = new User
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                Role = "Teacher"
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            var teacher = new Teacher
            {
                Id = user.Id,
                TeacherCode = "GV" + user.Id.ToString("D3"),
                Degree = dto.Degree
            };

            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            return true;
        }

        // ✅ Danh sách sinh viên
        public async Task<IEnumerable<StudentDto>> GetAllStudentsAsync()
        {
            var students = await _context.Students
                .Include(s => s.User)
                .Include(s => s.Department)
                .Include(s => s.Program)
                .ToListAsync();

            return students.Select(s => new StudentDto
            {
                Id = s.Id,
                StudentCode = s.StudentCode,
                FullName = s.User?.FullName ?? "",
                Email = s.User?.Email ?? "",
                Phone = s.User?.Phone ?? "",
                Gender = s.Gender,
                DateOfBirth = s.DateOfBirth,
                DepartmentName = s.Department?.Name ?? "",
                ProgramName = s.Program?.Name ?? ""
            }).ToList();
        }

        // ✅ Cập nhật thông tin người dùng
        public async Task<bool> UpdateAsync(int id, UpdateUserDto dto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return false;

            user.FullName = dto.FullName;
            user.Email = dto.Email;
            user.Phone = dto.Phone;

            return await _userRepository.UpdateAsync(user);
        }

        // ✅ Xoá người dùng
        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return false;

            _userRepository.Delete(user);
            await _userRepository.SaveChangesAsync();
            return true;
        }

        // ✅ Lấy vai trò người dùng
        public async Task<IEnumerable<string>> GetRolesAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return new List<string>();
            return new List<string> { user.Role };
        }

        // ✅ Admin đăng ký môn học cho sinh viên
        public async Task<bool> RegisterSubjectForStudentAsync(int studentId, RegisterSubjectDto dto)
        {
            return await _studentService.RegisterSubjectAsync(studentId, dto);
        }

        // ✅ Lấy chi tiết sinh viên theo ID (StudentDto)
        public async Task<StudentDto?> GetStudentByIdAsync(int id)
        {
            var student = await _studentRepository.GetByIdAsync(id);
            return student == null ? null : _mapper.Map<StudentDto>(student);
        }
        public async Task<bool> UpdateStudentAsync(int id, UpdateStudentDto dto)
        {
            var student = await _context.Students.Include(s => s.User).FirstOrDefaultAsync(s => s.Id == id);
            if (student == null || student.User == null) return false;

            // Cập nhật bảng Student
            student.StudentCode = dto.StudentCode;
            student.Gender = dto.Gender;
            student.DateOfBirth = dto.DateOfBirth;
            student.DepartmentId = dto.DepartmentId;
            student.ProgramId = dto.ProgramId;

            // Cập nhật bảng User
            student.User.FullName = dto.FullName;
            student.User.Email = dto.Email;
            student.User.Phone = dto.Phone;

            await _context.SaveChangesAsync();
            return true;
        }



        public async Task<IEnumerable<UserCredentialDto>> GetUserCredentialsAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return users.Select(u => new UserCredentialDto
            {
                Id = u.Id,
                Username = u.Username,
                Role = u.Role
            });
        }

        public async Task<bool> ChangePasswordAsync(int userId, string newPassword)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return false;

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            return await _userRepository.UpdateAsync(user);
        }

        public async Task<bool> ChangeRoleAsync(int userId, string newRole)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return false;

            user.Role = newRole;
            return await _userRepository.UpdateAsync(user);
        }


        public async Task<bool> CancelEnrollmentAsync(int studentId, int enrollmentId)
        {
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.Id == enrollmentId && e.StudentId == studentId);

            if (enrollment == null)
                return false;

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
