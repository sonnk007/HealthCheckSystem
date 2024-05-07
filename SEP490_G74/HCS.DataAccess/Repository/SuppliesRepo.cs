using HCS.ApplicationContext;
using HCS.DataAccess.IRepository;
using HCS.Domain.Models;

namespace HCS.DataAccess.Repository;


public interface ISuppliesRepo : IGenericRepo<Supply>
{
    Task<bool> RemoveById(int id);
}
public class SuppliesRepo : GenericRepo<Supply>, ISuppliesRepo
{
    public SuppliesRepo(HCSContext context) : base(context)
    {
    }
    public async Task<bool> RemoveById(int id)
    {
        var entity = await _dbSet.FindAsync(id);
        if (entity is null)
        {
            return false;
        }
        else
        {
            entity.IsDeleted = !entity.IsDeleted;
            return true;
        }
    }
}