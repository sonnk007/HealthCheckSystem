using HCS.ApplicationContext;
using HCS.DataAccess.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace HCS.DataAccess.Repository
{
    public class GenericRepo<T> : IGenericRepo<T> where T : class
    {
        protected readonly DbSet<T> _dbSet;
        protected readonly HCSContext _context;

        public GenericRepo(HCSContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public async Task<List<T>> GetAllAsync(Expression<Func<T, bool>>? filter)
        {
            if(filter != null)
            {
                return await _dbSet.Where(filter).ToListAsync();
            }
            return await _dbSet.ToListAsync();
        }

        public async Task<T> GetAsync(Expression<Func<T, bool>> filter)
        {
            IQueryable<T> query = _dbSet;
#pragma warning disable CS8603 // Possible null reference return.
            return await query.FirstOrDefaultAsync(filter);
#pragma warning restore CS8603 // Possible null reference return.
        }

        public async Task RemoveByIdAsync(int id)
        {
            T? existing = await _dbSet.FindAsync(id);
            if (existing != null) 
            {
                _dbSet.Remove(existing);
            }
        }
    }
}
