using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace HCS.DataAccess.IRepository
{
    public interface IGenericRepo<T> where T : class
    {
        Task<T> GetAsync(Expression<Func<T, bool>> filter);
        Task AddAsync(T entity);
        Task RemoveByIdAsync(int id);
        Task<List<T>> GetAllAsync(Expression<Func<T,bool>>? filter);
    }
}
