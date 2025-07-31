using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Threading.Tasks;

namespace StudentManagementAPI.Shared.Middlewares
{
    public class RateLimitingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RateLimitingMiddleware> _logger;
        private readonly IMemoryCache _cache;

        // Thiết lập cấu hình cơ bản
        private const int LIMIT = 100;              // Số lượng request tối đa
        private static readonly TimeSpan PERIOD = TimeSpan.FromMinutes(1); // Khoảng thời gian giới hạn

        public RateLimitingMiddleware(RequestDelegate next, ILogger<RateLimitingMiddleware> logger, IMemoryCache cache)
        {
            _next = next;
            _logger = logger;
            _cache = cache;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            var cacheKey = $"RateLimit_{ipAddress}";
            var requestCount = _cache.GetOrCreate<int>(cacheKey, entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = PERIOD;
                return 0;
            });

            if (requestCount >= LIMIT)
            {
                context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
                context.Response.Headers["Retry-After"] = PERIOD.TotalSeconds.ToString();
                await context.Response.WriteAsync("Too many requests. Please try again later.");
                _logger.LogWarning("Rate limit exceeded for IP: {IP}", ipAddress);
                return;
            }

            _cache.Set(cacheKey, requestCount + 1, PERIOD);

            await _next(context); // Tiếp tục pipeline
        }
    }
}
