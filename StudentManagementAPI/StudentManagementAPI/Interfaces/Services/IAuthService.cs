// IAuthService.cs
using StudentManagementAPI.DTOs.Auth;
using System.Threading.Tasks;

namespace StudentManagementAPI.Interfaces.Services
{
    public interface IAuthService
    {
        Task<AuthResponse?> LoginAsync(LoginRequest request);
    }
}
