// Interfaces/Repositories/IEducationProgramRepository.cs
using StudentManagementAPI.Models;

public interface IEducationProgramRepository
{
    Task<IEnumerable<EducationProgram>> GetAllAsync();
    Task<EducationProgram?> GetByIdAsync(int id);
    Task AddAsync(EducationProgram program);
    void Delete(EducationProgram program);
    Task SaveChangesAsync();
}
