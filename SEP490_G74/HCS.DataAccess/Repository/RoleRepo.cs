using HCS.ApplicationContext;
using HCS.DataAccess.IRepository;
using HCS.Domain.Models;

namespace HCS.DataAccess.Repository;

public interface IRoleRepo : IGenericRepo<Role>
{
    
}
public class RoleRepo : GenericRepo<Role> , IRoleRepo
{
    public RoleRepo(HCSContext context) : base(context)
    {
    }
}