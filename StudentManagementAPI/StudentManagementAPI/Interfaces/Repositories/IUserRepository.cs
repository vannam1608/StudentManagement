using StudentManagementAPI.Models;
using System.Threading.Tasks;

namespace StudentManagementAPI.Interfaces.Repositories
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<User?> GetByUsernameAsync(string username);
        Task<bool> IsUsernameTakenAsync(string username);

        Task<bool> UpdateAsync(User user);
        Task AddTeacherAsync(Teacher teacher);

        Task<(List<User>, int)> GetPagedAsync(int page, int pageSize);
    }
}
