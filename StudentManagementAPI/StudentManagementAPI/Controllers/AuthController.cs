using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.DTOs.Auth;
using StudentManagementAPI.Interfaces.Services;
using System.Security.Claims;

namespace StudentManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Đăng nhập và lấy token///
        /// </summary>
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.LoginAsync(request);

            if (result == null)
                return Unauthorized("Sai tài khoản hoặc mật khẩu.");

            if (result.Token == "Unauthorized")
                return Unauthorized("Bạn không có quyền truy cập.");

            return Ok(result);
        }

        /// <summary>
        /// Lấy thông tin người dùng hiện tại //
        /// </summary>
        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            var username = User.Identity?.Name ?? "";
            var fullName = User.FindFirst("fullName")?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            return Ok(new
            {
                username,
                fullName,
                role
            });
        }
    }
}
