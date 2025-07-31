// Interfaces/Services/IEducationProgramService.cs
using StudentManagementAPI.DTOs.EducationProgram;

public interface IEducationProgramService
{
    Task<IEnumerable<EducationProgramDto>> GetAllAsync();
    Task<bool> CreateAsync(CreateEducationProgramDto dto);
    Task<bool> DeleteAsync(int id);
}
