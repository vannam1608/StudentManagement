//using Microsoft.Extensions.Options;
//using Microsoft.IdentityModel.Tokens;
//using StudentManagementAPI.Data;
//using StudentManagementAPI.Models;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
//using System.Text;

//namespace StudentManagementAPI.Authorization
//{
//    public class JwtService
//    {
//        private readonly JwtSettings _jwtSettings;
//        private readonly AppDbContext _context;

//        public JwtService(IOptions<JwtSettings> options, AppDbContext context)
//        {
//            _jwtSettings = options?.Value ?? throw new ArgumentNullException(nameof(options));
//            _context = context;
//        }

//        public async Task<string> GenerateTokenAsync(User user)
//        {
//            if (user == null) throw new ArgumentNullException(nameof(user));

//            var claims = new List<Claim>
//            {
//                // ✅ Đảm bảo NameIdentifier là user.Id (int) để parse được
//                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),

//                // 👤 Username và vai trò
//                new Claim(ClaimTypes.Name, user.Username),
//                new Claim(ClaimTypes.Role, user.Role ?? ""),

//                // 🔖 Thông tin phụ trợ
//                new Claim("fullName", user.FullName ?? ""),
//                new Claim("IsRoot", (user.Role == "Admin").ToString().ToLower()),
//                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
//                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
//            };

//            // ✅ Nếu là sinh viên thì thêm studentId
//            if (user.Role == "Student")
//            {
//                var student = await _context.Students.FindAsync(user.Id);
//                if (student != null)
//                {
//                    claims.Add(new Claim("studentId", student.Id.ToString()));
//                }
//            }

//            // ✅ Gán các quyền (permissions)
//            var permissions = GetPermissionsForUser(user);
//            foreach (var permission in permissions)
//            {
//                claims.Add(new Claim("Permission", permission));
//            }

//            // 🔐 Ký token
//            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
//            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//            var token = new JwtSecurityToken(
//                issuer: _jwtSettings.Issuer,
//                audience: _jwtSettings.Audience,
//                claims: claims,
//                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
//                signingCredentials: creds
//            );

//            return new JwtSecurityTokenHandler().WriteToken(token);
//        }

//        private List<string> GetPermissionsForUser(User user)
//        {
//            return user.Role switch
//            {
//                "Admin" => new List<string>
//        {
//            "user:view", "user:create", "user:update", "user:delete",
//            "department:view", "department:create", "department:update", "department:delete",
//            "program:view", "program:create", "program:update", "program:delete",
//            "teacher:view", "teacher:create", "teacher:update", "teacher:delete",
//            "subject:view", "subject:create", "subject:update", "subject:delete",
//            "semester:view", "semester:create", "semester:update", "semester:toggle",

//            // 👉 CourseClass quyền đầy đủ
//            "courseclass:view",
//            "courseclass:create",
//            "courseclass:update",
//            "courseclass:delete",
//            "courseclass:assign",   // Gán giáo viên
//            "courseclass:view_by_subject",
//            "courseclass:view_by_teacher",
//            "courseclass:view_by_semester",

//            "notification:create", "notification:view",
//            "report:view",
//            "score:view_all", "score:view", "score:view_by_student", "score:input", "score:auto_create",
//            "subject:register_any",


//            "enrollment:view",
//            "enrollment:create",
//            "enrollment:update",
//            "enrollment:delete",

//            "notification:create",
//            "notification:view",

//        },

//                "Teacher" => new List<string>
//        {
//            "teacher:view_self", "teacher:update_self",

//            // 👉 CourseClass liên quan đến giảng dạy
//            "courseclass:view_assigned",
//            "courseclass:view_by_teacher",
//            "student:view_in_class",
//            "classpost:view", "classpost:create", "classpost:update", "classpost:delete",

//            "score:input"
//        },

//                "Student" => new List<string>
//        {
//            "student:view_self", "student:update_self",
//            "subject:view", "subject:view_self", "subject:register",

//            // 👉 CourseClass để xem lớp đã đăng ký và lịch học
//            "courseclass:view_self",
//            "courseclass:view_by_subject",
//            "courseclass:view_by_semester",

//            "schedule:view_self",
//            "score:view_self",
//            "notification:view",


//        },

//                _ => new List<string>()
//            };
//        }



//    }
//}
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

            //// 🔐 Gán permission theo Role
            //var permissions = _permissionProvider.GetPermissionsForRole(user.Role ?? "");
            //foreach (var p in permissions)
            //{
            //    claims.Add(new Claim("Permission", p));
            //}

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
