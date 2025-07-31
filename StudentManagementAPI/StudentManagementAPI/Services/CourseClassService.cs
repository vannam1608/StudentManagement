using AutoMapper;
using StudentManagementAPI.DTOs.CourseClass;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StudentManagementAPI.Services
{
    public class CourseClassService : ICourseClassService
    {
        private readonly ICourseClassRepository _courseClassRepository;
        private readonly IMapper _mapper;

        public CourseClassService(ICourseClassRepository courseClassRepository, IMapper mapper)
        {
            _courseClassRepository = courseClassRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CourseClassDto>> GetAllAsync()
        {
            var classes = await _courseClassRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<CourseClassDto>>(classes);
        }

        public async Task<CourseClassDto?> GetByIdAsync(int id)
        {
            var courseClass = await _courseClassRepository.GetByIdAsync(id);
            return _mapper.Map<CourseClassDto>(courseClass);
        }

        public async Task<bool> CreateAsync(CreateCourseClassDto dto)
        {
            var entity = _mapper.Map<CourseClass>(dto);
            await _courseClassRepository.CreateAsync(entity);
            return entity.Id > 0;
        }

        public async Task<bool> UpdateAsync(int id, CreateCourseClassDto dto)
        {
            var existing = await _courseClassRepository.GetByIdAsync(id);
            if (existing == null) return false;

            _mapper.Map(dto, existing);
            await _courseClassRepository.UpdateAsync(existing);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _courseClassRepository.GetByIdAsync(id);
            if (existing == null) return false;

            await _courseClassRepository.DeleteAsync(id);
            return true;
        }

        public async Task<IEnumerable<CourseClassDto>> GetBySubjectIdAsync(int subjectId)
        {
            var result = await _courseClassRepository.GetBySubjectAsync(subjectId);
            return _mapper.Map<IEnumerable<CourseClassDto>>(result);
        }

        public async Task<IEnumerable<CourseClassDto>> GetByTeacherIdAsync(int teacherId)
        {
            var result = await _courseClassRepository.GetByTeacherIdAsync(teacherId);
            return _mapper.Map<IEnumerable<CourseClassDto>>(result);
        }

    }
}
