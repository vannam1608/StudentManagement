using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.DTOs.Enrollment;
using StudentManagementAPI.DTOs.Schedule;
using StudentManagementAPI.DTOs.Score;
using StudentManagementAPI.DTOs.Student;
using StudentManagementAPI.DTOs.Subject;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Models;
using StudentManagementAPI.Models.Common;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace StudentManagementAPI.Services
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _studentRepository;
        private readonly IEnrollmentRepository _enrollmentRepository;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public StudentService(
            IStudentRepository studentRepository,
            IEnrollmentRepository enrollmentRepository,
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor)
        {
            _studentRepository = studentRepository;
            _enrollmentRepository = enrollmentRepository;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<StudentDto>> GetAllAsync()
        {
            var students = await _studentRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<StudentDto>>(students);
        }

        public async Task<StudentDto?> GetByIdAsync(int id)
        {
            var student = await _studentRepository.GetByIdAsync(id);
            return student == null ? null : _mapper.Map<StudentDto>(student);
        }

        public async Task<bool> CreateAsync(CreateStudentDto dto)
        {
            var student = _mapper.Map<Student>(dto);
            return await _studentRepository.CreateAsync(student);
        }

        public async Task<bool> UpdateAsync(int id, UpdateStudentDto dto)
        {
            var student = await _studentRepository.GetByIdAsync(id);
            if (student == null || student.User == null) return false;

            student.User.FullName = dto.FullName;
            student.User.Email = dto.Email;
            student.User.Phone = dto.Phone;
            student.Gender = dto.Gender;
            student.DateOfBirth = dto.DateOfBirth;

            // ❗ Chỉ admin mới được cập nhật các thông tin bên dưới
            var user = _httpContextAccessor.HttpContext?.User;

            if (user != null && user.IsInRole("Admin"))
            {
                student.DepartmentId = dto.DepartmentId;
                student.ProgramId = dto.ProgramId;
                student.StudentCode = dto.StudentCode;
            }

            // ❌ Nếu không phải Admin => bỏ qua các trường này

            return await _studentRepository.UpdateAsync(student);
        }


        public async Task<bool> DeleteAsync(int id)
        {
            return await _studentRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<EnrollmentDto>> GetEnrollmentsAsync(int studentId)
        {
            var enrollments = await _enrollmentRepository.GetByStudentIdAsync(studentId);
            return enrollments == null ? new List<EnrollmentDto>() : _mapper.Map<IEnumerable<EnrollmentDto>>(enrollments);
        }

        public async Task<bool> RegisterSubjectAsync(int studentId, RegisterSubjectDto dto)
        {
            try
            {
                var enrollment = new Enrollment
                {
                    StudentId = studentId,
                    CourseClassId = dto.CourseClassId,
                    EnrollDate = DateTime.UtcNow
                };

                await _enrollmentRepository.AddAsync(enrollment);
                await _enrollmentRepository.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] RegisterSubjectAsync: {ex.Message}");
                return false;
            }
        }

        public async Task<IEnumerable<ScheduleDto>> GetScheduleAsync(int studentId)
        {
            var result = await _enrollmentRepository.GetScheduleByStudentIdAsync(studentId);
            if (result == null || !result.Any())
                return new List<ScheduleDto>();

            return result.Select(c => new ScheduleDto
            {
                SubjectName = c.Subject?.Name ?? "",
                ClassCode = c.ClassCode,
                Schedule = c.Schedule ?? "",
                TeacherName = c.Teacher?.User?.FullName ?? "",
                Semester = c.Semester?.Name ?? ""
            });
        }

        public async Task<IEnumerable<ScoreDto>> GetScoresAsync(int studentId)
        {
            var result = await _enrollmentRepository.GetScoresByStudentIdAsync(studentId);
            if (result == null || !result.Any())
                return new List<ScoreDto>();

            return result.Select(s => new ScoreDto
            {
                Id = s.Id,
                EnrollmentId = s.EnrollmentId,
                StudentCode = s.Enrollment?.Student?.StudentCode ?? "",
                SubjectName = s.Enrollment?.CourseClass?.Subject?.Name ?? "",
                ClassCode = s.Enrollment?.CourseClass?.ClassCode ?? "",
                Midterm = s.Midterm,
                Final = s.Final,
                Other = s.Other,
                Total = Math.Round((s.Midterm ?? 0) * 0.3 + (s.Other ?? 0) * 0.2 + (s.Final ?? 0) * 0.5, 2)
            });
        }

        public async Task<IEnumerable<SubjectDto>> GetRegisteredSubjectsAsync(int studentId)
        {
            var result = await _enrollmentRepository.GetSubjectsByStudentIdAsync(studentId);
            if (result == null || !result.Any())
                return new List<SubjectDto>();

            return result.Select(s => new SubjectDto
            {
                Id = s.Id,
                SubjectCode = s.SubjectCode,
                Name = s.Name,
                Description = s.Description ?? "",
                Credit = s.Credit,
                SemesterId = s.SemesterId,
                SemesterName = s.SemesterName
            });
        }

        public async Task<PaginatedResult<StudentDto>> GetPagedAsync(int page, int pageSize, string? studentCode = null)
        {
            var query = await _studentRepository.GetQueryableAsync();

            query = query
                .Include(s => s.User)
                .Include(s => s.Department)
                .Include(s => s.Program);

            // 👇 Lọc theo mã sinh viên (exact match, không phân biệt hoa thường)
            if (!string.IsNullOrWhiteSpace(studentCode))
            {
                studentCode = studentCode.Trim().ToLower();
                query = query.Where(s => s.StudentCode.ToLower() == studentCode);
            }

            var totalItems = await query.CountAsync();

            var students = await query
                .OrderBy(s => s.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var studentDtos = _mapper.Map<IEnumerable<StudentDto>>(students);

            return new PaginatedResult<StudentDto>
            {
                Data = studentDtos,
                TotalItems = totalItems,
                CurrentPage = page,
                PageSize = pageSize
            };
        }


        
    }
}
