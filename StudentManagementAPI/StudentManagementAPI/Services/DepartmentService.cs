using AutoMapper;
using StudentManagementAPI.DTOs.Department;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Models;

public class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _repository;
    private readonly IMapper _mapper;

    public DepartmentService(IDepartmentRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<DepartmentDto>> GetAllAsync()
    {
        var list = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<DepartmentDto>>(list);
    }

    public async Task<DepartmentDto?> GetByIdAsync(int id)
    {
        var department = await _repository.GetByIdAsync(id);
        return _mapper.Map<DepartmentDto>(department);
    }

    public async Task<bool> CreateAsync(CreateDepartmentDto dto)
    {
        var entity = _mapper.Map<Department>(dto);
        await _repository.CreateAsync(entity);
        return entity.Id > 0;
    }

    public async Task<bool> UpdateAsync(int id, CreateDepartmentDto dto)
    {
        var department = await _repository.GetByIdAsync(id);
        if (department == null) return false;

        department.Name = dto.Name;
        await _repository.UpdateAsync(department);
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var department = await _repository.GetByIdAsync(id);
        if (department == null) return false;

        await _repository.DeleteAsync(department);
        return true;
    }
}
