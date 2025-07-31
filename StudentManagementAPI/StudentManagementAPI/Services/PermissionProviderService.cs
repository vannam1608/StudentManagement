using System.Text.Json;

namespace StudentManagementAPI.Services
{
    public class PermissionProviderService
    {
        private readonly Dictionary<string, List<string>> _permissions;

        public PermissionProviderService(IWebHostEnvironment env)
        {
            var filePath = Path.Combine(env.ContentRootPath, "permissions.json");

            if (!File.Exists(filePath))
                throw new FileNotFoundException("Không tìm thấy file permissions.json");

            var json = File.ReadAllText(filePath);
            _permissions = JsonSerializer.Deserialize<Dictionary<string, List<string>>>(json)
                           ?? new Dictionary<string, List<string>>();
        }

        public List<string> GetPermissionsForRole(string role)
        {
            return _permissions.TryGetValue(role, out var perms) ? perms : new List<string>();
        }
    }
}
