using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.DTOs.Subject;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Models;
using StudentManagementAPI.Models.Common;

namespace StudentManagementAPI.Services
{
    public class SubjectService : ISubjectService
    {
        private readonly ISubjectRepository _subjectRepository;
        private readonly IMapper _mapper;

        public SubjectService(ISubjectRepository subjectRepository, IMapper mapper)
        {
            _subjectRepository = subjectRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<SubjectDto>> GetAllAsync()
        {
            var query = await _subjectRepository.GetQueryableAsync();
            var subjects = await query.Include(s => s.Semester).ToListAsync();
            return _mapper.Map<IEnumerable<SubjectDto>>(subjects);
        }

        public async Task<SubjectDto?> GetByIdAsync(int id)
        {
            var subject = await _subjectRepository.GetByIdAsync(id);
            return subject == null ? null : _mapper.Map<SubjectDto>(subject);
        }

        public async Task<bool> CreateAsync(SubjectDto dto)
        {
            var subject = _mapper.Map<Subject>(dto);
            return await _subjectRepository.CreateAsync(subject);
        }

        public async Task<bool> UpdateAsync(int id, SubjectDto dto)
        {
            var existing = await _subjectRepository.GetByIdAsync(id);
            if (existing == null) return false;

            // Map fields manually or use mapper
            existing.SubjectCode = dto.SubjectCode;
            existing.Name = dto.Name;
            existing.Credit = dto.Credit;
            existing.Description = dto.Description;
            existing.SemesterId = dto.SemesterId;

            return await _subjectRepository.UpdateAsync(existing);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _subjectRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<SubjectDto>> SearchByNameAsync(string name)
        {
            var query = await _subjectRepository.GetQueryableAsync();
            var results = await query
                .Include(s => s.Semester)
                .Where(s => s.Name.Contains(name))
                .ToListAsync();

            return _mapper.Map<IEnumerable<SubjectDto>>(results);
        }

        public async Task<IEnumerable<SubjectDto>> GetAvailableSubjectsAsync()
        {
            var courseClasses = await _subjectRepository.GetCourseClassesOfOpenSemester();

            var subjects = courseClasses
                .Select(cc => cc.Subject)
                .Where(s => s != null)
                .DistinctBy(s => s.Id)
                .ToList();

            return _mapper.Map<IEnumerable<SubjectDto>>(subjects);
        }

        public async Task<IEnumerable<SubjectDto>> GetAvailableSubjectsBySemesterAsync(int semesterId)
        {
            var courseClasses = await _subjectRepository.GetCourseClassesBySemesterAsync(semesterId);

            var subjects = courseClasses
                .Where(cc => cc.Subject != null)
                .Select(cc => cc.Subject!)
                .DistinctBy(s => s.Id)
                .ToList();

            return _mapper.Map<IEnumerable<SubjectDto>>(subjects);
        }

        public async Task<PaginatedResult<SubjectDto>> GetPagedAsync(
    int page,
    int pageSize,
    string? keyword = null,
    int? semesterId = null)
        {
            // Sanitize input
            page = page <= 0 ? 1 : page;
            pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 100);

            // Gọi repository đã dùng truy vấn SQL
            var (items, totalItems) = await _subjectRepository.GetPagedAsync(page, pageSize, keyword, semesterId);

            // Không cần map nữa, đã là SubjectDto
            return new PaginatedResult<SubjectDto>
            {
                Data = items,
                TotalItems = totalItems,
                CurrentPage = page,
                PageSize = pageSize
            };
        }





    }
}
