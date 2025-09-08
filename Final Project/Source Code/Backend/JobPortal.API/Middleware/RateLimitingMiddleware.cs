// using Microsoft.Extensions.Caching.Memory;
// using System.Net;

// namespace JobPortal.API.Middleware
// {
//     public class RateLimitingMiddleware
//     {
//         private readonly RequestDelegate _next;
//         private readonly IMemoryCache _cache;
//         private readonly ILogger<RateLimitingMiddleware> _logger;
//         private readonly int _requestLimit;
//         private readonly TimeSpan _timeWindow;

//         public RateLimitingMiddleware(
//             RequestDelegate next, 
//             IMemoryCache cache, 
//             ILogger<RateLimitingMiddleware> logger,
//             IConfiguration configuration)
//         {
//             _next = next;
//             _cache = cache;
//             _logger = logger;
//             _requestLimit = int.Parse(configuration["RateLimit:RequestLimit"] ?? "100");
//             _timeWindow = TimeSpan.FromMinutes(int.Parse(configuration["RateLimit:TimeWindowMinutes"] ?? "1"));
//         }

//         public async Task InvokeAsync(HttpContext context)
//         {
//             var clientId = GetClientIdentifier(context);
//             var key = $"rate_limit_{clientId}";

//             var requestCount = _cache.Get<int?>(key) ?? 0;

//             if (requestCount >= _requestLimit)
//             {
//                 _logger.LogWarning($"Rate limit exceeded for client: {clientId}");
//                 context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
//                 await context.Response.WriteAsync("Rate limit exceeded. Please try again later.");
//                 return;
//             }

//             _cache.Set(key, requestCount + 1, _timeWindow);
//             await _next(context);
//         }

//         private string GetClientIdentifier(HttpContext context)
//         {
//             // Try to get user ID from JWT token first
//             var userId = context.User?.FindFirst("userId")?.Value;
//             if (!string.IsNullOrEmpty(userId))
//                 return $"user_{userId}";

//             // Fall back to IP address
//             var ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
//             return $"ip_{ipAddress}";
//         }
//     }
// }
