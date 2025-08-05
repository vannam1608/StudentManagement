using Microsoft.AspNetCore.Authorization;
using StudentManagementAPI.Services;
using System.Security.Claims;

namespace StudentManagementAPI.Authorization
{
    public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
    {
        private readonly PermissionProviderService _permissionProvider;

        public PermissionHandler(PermissionProviderService permissionProvider)
        {
            _permissionProvider = permissionProvider;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            var role = context.User.FindFirst(ClaimTypes.Role)?.Value;

            // Nếu không có Role => từ chối luôn
            if (string.IsNullOrWhiteSpace(role))
            {
                context.Fail();
                return Task.CompletedTask;
            }

            var permissions = _permissionProvider.GetPermissionsForRole(role);

            if (permissions.Contains(requirement.Permission))
            {
                context.Succeed(requirement);
            }
            else
            {
                context.Fail(); // ❗ rõ ràng từ chối nếu không có quyền
            }

            return Task.CompletedTask;
        }
    }
}
