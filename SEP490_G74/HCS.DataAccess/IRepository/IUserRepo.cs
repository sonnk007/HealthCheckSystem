using HCS.Domain;
using HCS.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HCS.DataAccess.IRepository
{
    public interface IUserRepo : IGenericRepo<User>
    {
        public Task<UserJWTModel?> GetProfile(string email);
        public Task<List<User>> GetAllDoctorByCategoryIdAsync(int categoryId);
        Task<User?> GetUserWithContact(int userId);

    }
}
