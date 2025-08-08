using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using StudentManagementAPI.Data;
using StudentManagementAPI.Models;
using StudentManagementAPI.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StudentManagementAPI.Authorization
{
    public class JwtService
    {
        private readonly JwtSettings _jwtSettings;
        private readonly AppDbContext _context;
        private readonly PermissionProviderService _permissionProvider;

        public JwtService(IOptions<JwtSettings> options, AppDbContext context, PermissionProviderService permissionProvider)
        {
            _jwtSettings = options?.Value ?? throw new ArgumentNullException(nameof(options));
            _context = context;
            _permissionProvider = permissionProvider;
        }

        public async Task<string> GenerateTokenAsync(User user)
        {
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim("nameid", user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role ?? ""),
            new Claim("fullName", user.FullName ?? ""),
            new Claim(JwtRegisteredClaimNames.Sub, user.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            // Nếu là Student, thêm studentId
            if (user.Role == "Student")
            {
                var student = await _context.Students.FindAsync(user.Id);
                if (student != null)
                    claims.Add(new Claim("studentId", student.Id.ToString()));
            }


            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

}
