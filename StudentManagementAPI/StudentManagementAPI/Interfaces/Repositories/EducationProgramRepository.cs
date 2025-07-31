// Repositories/EducationProgramRepository.cs
using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.Data;
using StudentManagementAPI.Models;
using StudentManagementAPI.Interfaces.Repositories;

public class EducationProgramRepository : IEducationProgramRepository
{
    private readonly AppDbContext _context;

    public EducationProgramRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<EducationProgram>> GetAllAsync()
    {
        return await _context.EducationPrograms
            .Include(p => p.Students)
            .ToListAsync();
    }

    public async Task<EducationProgram?> GetByIdAsync(int id)
    {
        return await _context.EducationPrograms.FindAsync(id);
    }

    public async Task AddAsync(EducationProgram program)
    {
        _context.EducationPrograms.Add(program);
        await _context.SaveChangesAsync();
    }

    public void Delete(EducationProgram program)
    {
        _context.EducationPrograms.Remove(program);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
