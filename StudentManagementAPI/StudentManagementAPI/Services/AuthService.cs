using Microsoft.Extensions.Logging;
using StudentManagementAPI.Authorization;
using StudentManagementAPI.DTOs.Auth;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Models;




namespace StudentManagementAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtService _jwtService;
        private readonly ILogger<AuthService> _logger;

        public AuthService(IUserRepository userRepository, JwtService jwtService, ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
            _logger = logger;
        }

        

        public async Task<AuthResponse?> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.GetByUsernameAsync(request.Username);

            if (user == null)
            {
                _logger.LogWarning("🔒 Login failed - User not found: {Username}", request.Username);
                return null;
            }

            if (user.PasswordHash != request.Password)
            {
                _logger.LogWarning("🔒 Login failed - Wrong password for user: {Username}", request.Username);
                return null;
            }

            _logger.LogInformation("🔓 Login successful for user: {Username}", request.Username);

            var token = await _jwtService.GenerateTokenAsync(user);

            return new AuthResponse
            {
                Token = token,
                FullName = user.FullName,
                Role = user.Role
            };
        }


        public async Task<ServiceResult> ChangePasswordAsync(string username, ChangePasswordRequest request)
        {
            var user = await _userRepository.GetByUsernameAsync(username);
            if (user == null)
            {
                _logger.LogWarning("🔒 Đổi mật khẩu thất bại - Không tìm thấy user: {Username}", username);
                return ServiceResult.Fail("Người dùng không tồn tại.");
            }

            if (user.PasswordHash != request.CurrentPassword)
            {
                _logger.LogWarning("🔒 Đổi mật khẩu thất bại - Sai mật khẩu cũ cho user: {Username}", username);
                return ServiceResult.Fail("Mật khẩu hiện tại không đúng.");
            }

            if (request.NewPassword != request.ConfirmNewPassword)
            {
                return ServiceResult.Fail("Mật khẩu mới và xác nhận không khớp.");
            }

            user.PasswordHash = request.NewPassword;
            await _userRepository.UpdateAsync(user);

            _logger.LogInformation("🔒 Đổi mật khẩu thành công cho user: {Username}", username);
            return ServiceResult.Ok();
        }

    }
}
