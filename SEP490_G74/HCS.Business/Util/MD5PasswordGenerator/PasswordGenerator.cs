using System.Security.Cryptography;
using System.Text;

namespace HCS.Business.Util.MD5PasswordGenerator
{
    public static class PasswordGenerator
    {
        public static string GenerateRandomPassword(int length = 8)
        {
            const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?";

            var password = new StringBuilder();
            Random random = new Random();

            for (int i = 0; i < length; i++)
            {
                int index = random.Next(validChars.Length);
                password.Append(validChars[index]);
            }

            return password.ToString();
        }
        public static string GetMD5Hash(string input)
        {
            using (MD5 md5 = MD5.Create())
            {
                var inputBytes = Encoding.UTF8.GetBytes(input);
                var hashBytes = md5.ComputeHash(inputBytes);

                var stringBuilder = new StringBuilder();
                foreach (var t in hashBytes)
                {
                    stringBuilder.Append(t.ToString("x2"));
                }

                return stringBuilder.ToString();
            }
        }
    }
}
