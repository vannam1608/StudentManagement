using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.DTOs.Auth;
using StudentManagementAPI.Interfaces.Services;
using System.Security.Claims;
using Microsoft.Extensions.Logging;

namespace StudentManagementAPI.Controllers
{
    [ApiController]
    [Route("api/auth")]
    [Tags("🛡️ Auth - Xác thực")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Đăng nhập và lấy token
        /// </summary>
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            _logger.LogInformation("🔑 Đang xử lý đăng nhập cho user: {Username}", request.Username);

            var result = await _authService.LoginAsync(request);

            if (result == null)
            {
                _logger.LogWarning("❌ Đăng nhập thất bại cho user: {Username}", request.Username);
                return Unauthorized("Sai tài khoản hoặc mật khẩu.");
            }

            if (result.Token == "Unauthorized")
            {
                _logger.LogWarning("⛔ User {Username} không có quyền truy cập.", request.Username);
                return Unauthorized("Bạn không có quyền truy cập.");
            }

            _logger.LogInformation("✅ Đăng nhập thành công cho user: {Username}", request.Username);
            return Ok(result);
        }

        /// <summary>
        /// Lấy thông tin người dùng hiện tại
        /// </summary>
        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            var username = User.Identity?.Name ?? "";
            var fullName = User.FindFirst("fullName")?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            _logger.LogInformation("👤 Truy xuất thông tin người dùng: {Username} - Role: {Role}", username, role);

            return Ok(new
            {
                username,
                fullName,
                role
            });
        }

        /// <summary>
        /// Đổi mật khẩu cho người dùng hiện tại
        /// </summary>
        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var username = User.Identity?.Name ?? "";

            _logger.LogInformation("🔒 Đang xử lý đổi mật khẩu cho user: {Username}", username);

            var result = await _authService.ChangePasswordAsync(username, request);

            if (!result.Success)
            {
                _logger.LogWarning("❌ Đổi mật khẩu thất bại cho user: {Username} - Lý do: {Message}", username, result.Message);
                return BadRequest(result.Message);
            }

            _logger.LogInformation("✅ Đổi mật khẩu thành công cho user: {Username}", username);
            return Ok("Đổi mật khẩu thành công.");
        }

    }
}
