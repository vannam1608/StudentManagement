using StudentManagementAPI.DTOs.Auth;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Authorization;
using StudentManagementAPI.Models;
using System.Threading.Tasks;

namespace StudentManagementAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtService _jwtService;

        public AuthService(IUserRepository userRepository, JwtService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.GetByUsernameAsync(request.Username);

            // So sánh chuỗi thường, KHÔNG dùng BCrypt
            if (user == null || user.PasswordHash != request.Password)
                throw new UnauthorizedAccessException("Invalid credentials");

            var token = await _jwtService.GenerateTokenAsync(user); // ✅


            return new AuthResponse
            {
                Token = token,
                FullName = user.FullName,
                Role = user.Role
            };
        }

    }
}
