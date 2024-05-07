using HCS.Domain;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HCS.Business.Util.JWT
{
    public class JwtTokenHelper
    {
        public static string CreateToken(UserJWTModel user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();

            var jwtKeyBytes = Encoding.UTF8.GetBytes("hcs123456789123456");

            var tokenDesc = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Role, user.RoleName)
                }),
                Expires = DateTime.UtcNow.AddMinutes(3600),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(jwtKeyBytes), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = jwtTokenHandler.CreateToken(tokenDesc);

            return jwtTokenHandler.WriteToken(token);
        }
    }
}
