using Day12api.Context;
using Day12api.Repositories;
using Day12api.Security;
using Day12api.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace Day12api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddScoped<IBookRepository, BookRepository>();
            builder.Services.AddScoped<IBookService, BookService>();


            // Add services to the container.
            builder.Services.AddControllers();
            
            // Database connection
            var sql_section = builder.Configuration.GetSection("sql");
            //string connectionstring = sql_section["connection"];
            const string connectionstring = "Data Source=PTPLL605;" +
          "Initial Catalog=sampledb;" +
          "Integrated Security=True;" +
      "TrustServerCertificate=True;";

            // JWT config
            builder.Services.Configure<JWTOption>(builder.Configuration.GetSection("Jwt"));
            var jwt = builder.Configuration.GetSection("Jwt");
            var issuer = jwt["Issuer"];
            var audience = jwt["Audience"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,

                    ValidIssuer = issuer,
                    ValidAudience = audience,
                    IssuerSigningKey = key,

                    ClockSkew = TimeSpan.Zero,
                    RoleClaimType = ClaimTypes.Role,
                    NameClaimType = ClaimTypes.NameIdentifier
                };
            });

            builder.Services.AddDbContext<MyAppDbContext>(options =>
                options.UseSqlServer(connectionstring));

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
