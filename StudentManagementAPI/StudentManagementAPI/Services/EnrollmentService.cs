using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.DTOs;
using StudentManagementAPI.DTOs.Common;
using StudentManagementAPI.DTOs.Enrollment;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Models;
using StudentManagementAPI.Models.Common;

namespace StudentManagementAPI.Services
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly IEnrollmentRepository _enrollmentRepository;
        private readonly IMapper _mapper;

        public EnrollmentService(IEnrollmentRepository enrollmentRepository, IMapper mapper)
        {
            _enrollmentRepository = enrollmentRepository;
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

        public async Task<IEnumerable<EnrollmentDto>> GetByStudentAndSemesterAsync(int studentId, int? semesterId)
        {
            var enrollments = await _enrollmentRepository.GetByStudentAndSemesterAsync(studentId, semesterId);
            return _mapper.Map<IEnumerable<EnrollmentDto>>(enrollments);
        }

        public async Task<PaginatedResult<EnrollmentDto>> GetPagedAsync(PaginationQueryDto query)
        {
            var source = _enrollmentRepository.Query()
                .OrderBy(e => e.StudentId);

            var totalItems = await source.CountAsync();

            var enrollments = await source
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            var items = _mapper.Map<IEnumerable<EnrollmentDto>>(enrollments);

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
