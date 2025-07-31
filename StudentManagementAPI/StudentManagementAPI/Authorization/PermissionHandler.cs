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

            if (string.IsNullOrEmpty(role))
                return Task.CompletedTask;

            var permissions = _permissionProvider.GetPermissionsForRole(role);

            if (permissions.Contains(requirement.Permission))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
