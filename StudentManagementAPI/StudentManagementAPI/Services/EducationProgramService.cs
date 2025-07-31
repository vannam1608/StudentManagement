// Services/EducationProgramService.cs
using AutoMapper;
using StudentManagementAPI.DTOs.EducationProgram;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Models;

public class EducationProgramService : IEducationProgramService
{
    private readonly IEducationProgramRepository _repository;
    private readonly IMapper _mapper;

    public EducationProgramService(IEducationProgramRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<EducationProgramDto>> GetAllAsync()
    {
        var programs = await _repository.GetAllAsync();
        return programs.Select(p => new EducationProgramDto
        {
            Id = p.Id,
            Name = p.Name,
            StudentCount = p.Students.Count
        }).ToList();
    }

    public async Task<bool> CreateAsync(CreateEducationProgramDto dto)
    {
        var program = new EducationProgram
        {
            Name = dto.Name
        };
        await _repository.AddAsync(program);
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var program = await _repository.GetByIdAsync(id);
        if (program == null) return false;

        _repository.Delete(program);
        await _repository.SaveChangesAsync();
        return true;
    }
}
