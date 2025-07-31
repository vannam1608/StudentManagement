using AutoMapper;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Interfaces.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StudentManagementAPI.Services
{
    public class BaseService<TEntity, TDto, TCreateDto> : IBaseService<TDto, TCreateDto>
        where TEntity : class
    {
        protected readonly IBaseRepository<TEntity> _repository;
        protected readonly IMapper _mapper;

        public BaseService(IBaseRepository<TEntity> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public virtual async Task<IEnumerable<TDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<TDto>>(entities);
        }

        public virtual async Task<TDto?> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return entity == null ? default : _mapper.Map<TDto>(entity);
        }

        public virtual async Task<TDto> CreateAsync(TCreateDto dto)
        {
            var entity = _mapper.Map<TEntity>(dto);
            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<TDto>(entity);
        }

        public virtual async Task<bool> UpdateAsync(int id, TCreateDto dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return false;

            _mapper.Map(dto, entity);
            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return true;
        }

        public virtual async Task<bool> DeleteAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return false;

            _repository.Delete(entity);
            await _repository.SaveChangesAsync();

            return true;
        }
    }
}
