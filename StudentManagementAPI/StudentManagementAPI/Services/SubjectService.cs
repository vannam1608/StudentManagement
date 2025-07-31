using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.DTOs.Subject;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Models;

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
            var subjects = await _subjectRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SubjectDto>>(subjects);
        }

        public async Task<SubjectDto?> GetByIdAsync(int id)
        {
            var subject = await _subjectRepository.GetByIdAsync(id);
            return _mapper.Map<SubjectDto>(subject);
        }

        public async Task<bool> CreateAsync(SubjectDto dto)
        {
            var subject = _mapper.Map<Subject>(dto);
            return await _subjectRepository.CreateAsync(subject);
        }

        public async Task<bool> UpdateAsync(int id, SubjectDto dto)
        {
            var subject = await _subjectRepository.GetByIdAsync(id);
            if (subject == null) return false;

            subject.SubjectCode = dto.SubjectCode;
            subject.Name = dto.Name;
            subject.Credit = dto.Credit;
            subject.Description = dto.Description;

            return await _subjectRepository.UpdateAsync(subject);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _subjectRepository.DeleteAsync(id);
        }
        public async Task<IEnumerable<SubjectDto>> SearchByNameAsync(string name)
        {
            var all = await _subjectRepository.GetAllAsync();
            var matched = all.Where(s => s.Name.Contains(name, StringComparison.OrdinalIgnoreCase));
            return _mapper.Map<IEnumerable<SubjectDto>>(matched);
        }

        public async Task<IEnumerable<SubjectDto>> GetAvailableSubjectsAsync()
        {
            // Lấy tất cả subject đang có lớp học phần trong học kỳ hiện tại
            var courseClasses = await _subjectRepository.GetCourseClassesOfOpenSemester(); // Bạn cần thêm repo hỗ trợ
            var subjectIds = courseClasses.Select(cc => cc.SubjectId).Distinct();
            var subjects = await _subjectRepository.GetAllAsync();
            var result = subjects.Where(s => subjectIds.Contains(s.Id));
            return _mapper.Map<IEnumerable<SubjectDto>>(result);
        }
        public async Task<IEnumerable<SubjectDto>> GetAvailableSubjectsBySemesterAsync(int semesterId)
        {
            var courseClasses = await _subjectRepository.GetCourseClassesBySemesterAsync(semesterId);

            var subjects = courseClasses
                .Select(c => c.Subject)
                .Distinct()
                .ToList();

            return _mapper.Map<IEnumerable<SubjectDto>>(subjects);
        }


    }
}
