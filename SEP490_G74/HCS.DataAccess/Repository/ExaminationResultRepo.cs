using HCS.ApplicationContext;
using HCS.DataAccess.IRepository;
using HCS.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace HCS.DataAccess.Repository;

public interface IExaminationResultRepo : IGenericRepo<ExaminationResult>
{
    public Task<bool> PayService(int medicalRecordId, int serviceId);
}
public class ExaminationResultRepo : GenericRepo<ExaminationResult>, IExaminationResultRepo
{
    public ExaminationResultRepo(HCSContext context) : base(context)
    {
        
    }

    public async Task<bool> PayService(int medicalRecordId, int serviceId)
    {
        var serviceMr = await _context.ServiceMedicalRecords
            .Where(x => x.MedicalRecordId == medicalRecordId && x.ServiceId == serviceId)
            .FirstOrDefaultAsync();
        if(serviceMr != null)
        {
            serviceMr.IsPaid = true;
            return true;
        }
        return false;
    }
}