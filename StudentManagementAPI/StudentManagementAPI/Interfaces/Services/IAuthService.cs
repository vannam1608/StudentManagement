// IAuthService.cs
using StudentManagementAPI.DTOs.Auth;
using System.Threading.Tasks;
using StudentManagementAPI.Models;


namespace StudentManagementAPI.Interfaces.Services
{
    public interface IAuthService
    {
        Task<AuthResponse?> LoginAsync(LoginRequest request);

        Task<ServiceResult> ChangePasswordAsync(string username, ChangePasswordRequest request);

    }
}
