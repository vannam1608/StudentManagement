using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.DTOs.Common;
using StudentManagementAPI.DTOs.Enrollment;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Models.Common;

namespace StudentManagementAPI.Services
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly IEnrollmentRepository _enrollmentRepository;
        private readonly ISemesterRepository _semesterRepository;
        private readonly IMapper _mapper;

        public EnrollmentService(
            IEnrollmentRepository enrollmentRepository,
            ISemesterRepository semesterRepository,
            IMapper mapper)
        {
            _enrollmentRepository = enrollmentRepository;
            _semesterRepository = semesterRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<EnrollmentDto>> GetAllAsync()
        {
            var entities = await _enrollmentRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<EnrollmentDto>>(entities);
        }

        public async Task<EnrollmentDto?> GetByIdAsync(int id)
        {
            var entity = await _enrollmentRepository.GetByIdAsync(id);
            return entity == null ? null : _mapper.Map<EnrollmentDto>(entity);
        }

        public async Task<int> CreateAsync(CreateEnrollmentDto dto)
        {
            var entity = _mapper.Map<Enrollment>(dto);
            await _enrollmentRepository.AddAsync(entity);
            await _enrollmentRepository.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> UpdateAsync(int id, CreateEnrollmentDto dto)
        {
            var entity = await _enrollmentRepository.GetByIdAsync(id);
            if (entity == null) return false;

            _mapper.Map(dto, entity);
            _enrollmentRepository.Update(entity);
            await _enrollmentRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _enrollmentRepository.GetByIdAsync(id);
            if (entity == null) return false;

            _enrollmentRepository.Delete(entity);
            await _enrollmentRepository.SaveChangesAsync();
            return true;
        }

        // SearchAsync có phân trang
            public async Task<PaginatedResult<EnrollmentDto>> SearchAsync(
                int? studentId = null,
                int? semesterId = null,
                string? studentCode = null,
                string? subjectName = null,
                int page = 1,
                int pageSize = 10)
            {
                // Nếu semesterId không truyền -> lấy học kỳ đang mở
                if (!semesterId.HasValue)
                {
                    var activeSemester = await _semesterRepository.Query()
                        .FirstOrDefaultAsync(s => s.IsOpen);

                    if (activeSemester != null)
                        semesterId = activeSemester.Id;
                }

                // Tạo query ban đầu
                var query = _enrollmentRepository.Query();

                if (studentId.HasValue)
                    query = query.Where(e => e.StudentId == studentId.Value);

                if (semesterId.HasValue)
                    query = query.Where(e => e.CourseClass.SemesterId == semesterId.Value);

                if (!string.IsNullOrEmpty(studentCode))
                    query = query.Where(e => e.Student.StudentCode.ToLower().Contains(studentCode.ToLower()));

                if (!string.IsNullOrEmpty(subjectName))
                    query = query.Where(e => e.CourseClass.Subject.Name.ToLower().Contains(subjectName.ToLower()));

                // Đếm tổng số bản ghi
                var totalItems = await query.CountAsync();

                // Lấy dữ liệu phân trang
                var itemsList = await query
                    .OrderBy(e => e.StudentId)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var items = _mapper.Map<IEnumerable<EnrollmentDto>>(itemsList);

            return new PaginatedResult<EnrollmentDto>
            {
                Data = items,
                TotalItems = totalItems,
                CurrentPage = page,
                PageSize = pageSize
            };
        }

        public async Task<PaginatedResult<EnrollmentDto>> GetPagedAsync(PaginationQueryDto query)
        {
            var source = _enrollmentRepository.Query();

            var totalItems = await source.CountAsync();

            var itemsList = await source
                .OrderBy(e => e.StudentId)
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            var items = _mapper.Map<IEnumerable<EnrollmentDto>>(itemsList);

            return new PaginatedResult<EnrollmentDto>
            {
                Data = items,
                TotalItems = totalItems,
                CurrentPage = query.Page,
                PageSize = query.PageSize
            };
        }
    }
}
