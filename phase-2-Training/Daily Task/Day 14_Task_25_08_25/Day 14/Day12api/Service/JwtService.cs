using Day12api.Security;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace WebApi.Security
{
    public class JwtService
    {
        public static string createJwtToken(JWTOption options, IEnumerable<Claim> claims)
        {
            var creds = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Key)), SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(issuer: options.Issuer, audience: options.Audience, claims: claims, expires: DateTime.Now.AddMinutes(30), signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}