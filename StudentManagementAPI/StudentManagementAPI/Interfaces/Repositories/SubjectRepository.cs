using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.Data;
using StudentManagementAPI.DTOs.Subject;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentManagementAPI.Repositories
{
    public class SubjectRepository : ISubjectRepository
    {
        private readonly AppDbContext _context;

        public SubjectRepository(AppDbContext context)
        {
            _context = context;
        }

        // Create
        public async Task<bool> CreateAsync(Subject subject)
        {
            await _context.Subjects.AddAsync(subject);
            return await _context.SaveChangesAsync() > 0;
        }

        // Read all
        public async Task<IEnumerable<Subject>> GetAllAsync()
        {
            return await _context.Subjects
                .Include(s => s.Semester)
                .ToListAsync();
        }

        // Read by ID
        public async Task<Subject?> GetByIdAsync(int id)
        {
            return await _context.Subjects
                .Include(s => s.Semester)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        // Update
        public async Task<bool> UpdateAsync(Subject subject)
        {
            var existing = await _context.Subjects.FindAsync(subject.Id);
            if (existing == null) return false;

            existing.Name = subject.Name;
            existing.SubjectCode = subject.SubjectCode;
            existing.Description = subject.Description;
            existing.Credit = subject.Credit;
            existing.SemesterId = subject.SemesterId;

            _context.Subjects.Update(existing);
            return await _context.SaveChangesAsync() > 0;
        }

        // Delete by ID
        public async Task<bool> DeleteAsync(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null) return false;

            _context.Subjects.Remove(subject);
            return await _context.SaveChangesAsync() > 0;
        }

        // Deprecated
        public Task<IEnumerable<Subject>> GetBySemesterAsync(int semesterId)
        {
            return Task.FromResult(Enumerable.Empty<Subject>());
        }

        // Get queryable
        public Task<IQueryable<Subject>> GetQueryableAsync()
        {
            return Task.FromResult(
                _context.Subjects
                    .Include(s => s.Semester)
                    .AsQueryable()
            );
        }

        
        public async Task<(IEnumerable<SubjectDto> Items, int TotalCount)> GetPagedAsync(
    int page, int pageSize, string? keyword, int? semesterId)
        {
            var connection = _context.Database.GetDbConnection();

            var items = new List<SubjectDto>();
            int totalCount = 0;

            using (var command = connection.CreateCommand())
            {
                await connection.OpenAsync();

                command.CommandText = @"
            SELECT s.Id, s.SubjectCode, s.Name, s.Description, s.Credit,
                   ISNULL(s.SemesterId, 0) AS SemesterId,
                   ISNULL(se.Name, '') AS SemesterName
            FROM Subjects s
            LEFT JOIN Semesters se ON s.SemesterId = se.Id
            WHERE (@keyword IS NULL 
                   OR s.Name LIKE '%' + @keyword + '%' 
                   OR s.SubjectCode LIKE '%' + @keyword + '%' 
                   OR s.Description LIKE '%' + @keyword + '%')
              AND (@semesterId IS NULL OR s.SemesterId = @semesterId)
            ORDER BY s.Id
            OFFSET (@page - 1) * @pageSize ROWS
            FETCH NEXT @pageSize ROWS ONLY;
        ";

                command.Parameters.Add(new SqlParameter("@keyword", string.IsNullOrWhiteSpace(keyword) ? DBNull.Value : keyword));
                command.Parameters.Add(new SqlParameter("@semesterId", semesterId ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@page", page));
                command.Parameters.Add(new SqlParameter("@pageSize", pageSize));

                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        items.Add(new SubjectDto
                        {
                            Id = reader.GetInt32(0),
                            SubjectCode = reader.GetString(1),
                            Name = reader.GetString(2),
                            Description = reader.GetString(3),
                            Credit = reader.GetInt32(4),
                            SemesterId = reader.GetInt32(5),
                            SemesterName = reader.GetString(6)
                        });
                    }
                }

                // Lấy tổng count
                command.CommandText = @"
            SELECT COUNT(*)
            FROM Subjects s
            WHERE (@keyword IS NULL 
                   OR s.Name LIKE '%' + @keyword + '%' 
                   OR s.SubjectCode LIKE '%' + @keyword + '%' 
                   OR s.Description LIKE '%' + @keyword + '%')
              AND (@semesterId IS NULL OR s.SemesterId = @semesterId);
        ";

                command.Parameters.Clear();
                command.Parameters.Add(new SqlParameter("@keyword", string.IsNullOrWhiteSpace(keyword) ? DBNull.Value : keyword));
                command.Parameters.Add(new SqlParameter("@semesterId", semesterId ?? (object)DBNull.Value));

                totalCount = (int)await command.ExecuteScalarAsync();
            }

            return (items, totalCount);
        }







        // CourseClasses in open semester
        public async Task<IEnumerable<CourseClass>> GetCourseClassesOfOpenSemester()
        {
            return await _context.CourseClasses
                .Include(cc => cc.Subject)
                .Include(cc => cc.Semester)
                .Where(cc => cc.Semester.IsOpen)
                .ToListAsync();
        }

        // CourseClasses by semester ID
        public async Task<IEnumerable<CourseClass>> GetCourseClassesBySemesterAsync(int semesterId)
        {
            return await _context.CourseClasses
                .Include(cc => cc.Subject)
                .Include(cc => cc.Semester)
                .Where(cc => cc.SemesterId == semesterId)
                .ToListAsync();
        }

        // For IBaseRepository compatibility
        public void Update(Subject entity)
        {
            _context.Subjects.Update(entity);
        }

        public void Delete(Subject entity)
        {
            _context.Subjects.Remove(entity);
        }

        public async Task AddAsync(Subject entity)
        {
            await _context.Subjects.AddAsync(entity);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
