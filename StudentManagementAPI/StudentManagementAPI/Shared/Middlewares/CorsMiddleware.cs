using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace StudentManagementAPI.Shared.Middlewares
{
    public class CorsMiddleware
    {
        private readonly RequestDelegate _next;

        public CorsMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");

            // Nếu là request OPTIONS (preflight), trả về 200 OK ngay
            if (context.Request.Method == HttpMethods.Options)
            {
                context.Response.StatusCode = StatusCodes.Status200OK;
                await context.Response.CompleteAsync();
                return;
            }

            await _next(context);
        }
    }
}
