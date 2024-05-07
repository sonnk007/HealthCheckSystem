using HCS.ApplicationContext;
using HCS.DataAccess.IRepository;
using HCS.Domain.Models;

namespace HCS.DataAccess.Repository;

public interface ISuppliesPrescriptionRepo : IGenericRepo<SuppliesPrescription>
{
    
}
public class SuppliesPrescriptionRepo :  GenericRepo<SuppliesPrescription>, ISuppliesPrescriptionRepo
{
    public SuppliesPrescriptionRepo(HCSContext context) : base(context)
    {
    }
}