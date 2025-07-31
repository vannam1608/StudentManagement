using AutoMapper;
using StudentManagementAPI.DTOs.Semester;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Models;

namespace StudentManagementAPI.Services
{
    public class SemesterService : ISemesterService
    {
        private readonly ISemesterRepository _repo;
        private readonly IMapper _mapper;

        public SemesterService(ISemesterRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<SemesterDto>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return _mapper.Map<IEnumerable<SemesterDto>>(list);
        }

        public async Task<SemesterDto?> GetByIdAsync(int id)
        {
            var entity = await _repo.GetByIdAsync(id);
            return entity is null ? null : _mapper.Map<SemesterDto>(entity);
        }

        public async Task<bool> CreateAsync(CreateSemesterDto dto)
        {
            var entity = _mapper.Map<Semester>(dto);
            await _repo.AddAsync(entity);
            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateAsync(int id, CreateSemesterDto dto)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity is null) return false;

            _mapper.Map(dto, entity);
            _repo.Update(entity);
            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity is null || entity.IsOpen) return false;

            _repo.Remove(entity);
            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleAsync(int id)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity is null) return false;

            if (DateTime.Today < entity.StartDate)
                return false;

            entity.IsOpen = !entity.IsOpen;
            _repo.Update(entity);
            await _repo.SaveChangesAsync();
            return true;
        }
    }
}
