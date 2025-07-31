using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagementAPI.Authorization
{
    public class AuthMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JwtSettings _settings;

        public AuthMiddleware(RequestDelegate next, IOptions<JwtSettings> options)
        {
            _next = next;
            _settings = options.Value;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
            {
                try
                {
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var key = Encoding.UTF8.GetBytes(_settings.SecretKey);
                    tokenHandler.ValidateToken(token, new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = true,
                        ValidIssuer = _settings.Issuer,
                        ValidateAudience = true,
                        ValidAudience = _settings.Audience,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    }, out SecurityToken validatedToken);

                    // Nếu token hợp lệ thì bạn có thể lưu thông tin user vào context.User
                    // Hoặc các bước khác tùy ý bạn
                }
                catch
                {
                    // Token không hợp lệ, có thể set context.Response.StatusCode = 401
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Unauthorized");
                    return;
                }
            }
            else
            {
                // Không có token, cũng có thể xử lý tùy ý (cho qua hoặc trả lỗi)
            }

            await _next(context);
        }
    }
}
