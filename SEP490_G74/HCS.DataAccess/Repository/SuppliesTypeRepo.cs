using HCS.ApplicationContext;
using HCS.DataAccess.IRepository;
using HCS.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace HCS.DataAccess.Repository;

public interface ISuppliesTypeRepo : IGenericRepo<SuppliesType>
{
    Task<SuppliesType?> GetSuppliesByTypeAsync(int id);
    Task<bool> AddSuppliesPrescription(int medicalRecordId, List<SuppliesPrescription> supplyPrescriptions, string diagnose);
    Task<List<SuppliesPrescription>> GetSelectedSuppliesByMrIdAsync(int id);
    Task<bool> RemoveById(int id);
}
public class SuppliesTypeRepo : GenericRepo<SuppliesType>, ISuppliesTypeRepo
{
    public SuppliesTypeRepo(HCSContext context) : base(context)
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

    public async Task<SuppliesType?> GetSuppliesByTypeAsync(int id)
    {
        var supplyType = await _context.SuppliesTypes
            .Where(c => c.SuppliesTypeId == id)
            .Include(c => c.Supplies)
            .FirstOrDefaultAsync();
        return supplyType;
    }

    public async Task<bool> AddSuppliesPrescription(int medicalRecordId, List<SuppliesPrescription> supplyPrescriptions, string diagnose)
    {
        var mr = await _context.MedicalRecords
            .Where(x => x.MedicalRecordId == medicalRecordId)
            .Include(x => x.ExaminationResult)
            .ThenInclude(x => x!.Prescription)
            .ThenInclude(x => x!.SuppliesPrescriptions)
            .FirstOrDefaultAsync();

        if(mr is not null && mr.ExaminationResult is not null)
        {
            

            if(mr.ExaminationResult.Prescription is null)
            {
                mr.ExaminationResult.Prescription = new Prescription()
                {
                    CreateDate = DateTime.Now,
                    Diagnose = diagnose,
                };
            }
            else
            {
                mr.ExaminationResult.Prescription.Diagnose = diagnose;
            }

           if(mr.ExaminationResult.Prescription.SuppliesPrescriptions is null)
           {
                mr.ExaminationResult.Prescription.SuppliesPrescriptions = new List<SuppliesPrescription>();
                mr.ExaminationResult.Prescription.SuppliesPrescriptions = supplyPrescriptions;

                //update stock of supplies
                //foreach(var supPre in supplyPrescriptions)
                //{
                //    var supply = await _context.Supplies.FindAsync(supPre.SupplyId);
                //    if(supply is not null)
                //    {
                //        supply.UnitInStock -= (short)supPre.Quantity;
                //    }
                //}
                mr.ExaminationResult.Prescription.Diagnose = diagnose;
                mr.ExaminationResult.Prescription.SuppliesPrescriptions = mr.ExaminationResult.Prescription.SuppliesPrescriptions.Where(x => x.Quantity > 0).ToList();
                return true;
           }
            else
            {
                foreach(var supPre in supplyPrescriptions)
                {
                    if (mr.ExaminationResult.Prescription.SuppliesPrescriptions.Any(x => x.SupplyId == supPre.SupplyId))
                    {
                        var supplyPrescription = mr.ExaminationResult.Prescription.SuppliesPrescriptions
                            .FirstOrDefault(x => x.SupplyId == supPre.SupplyId);
                        if(supplyPrescription is not null)
                        {
                            supplyPrescription.Quantity += supPre.Quantity;
                            supplyPrescription.Dose = supPre.Dose;
                        }
                    }
                    else
                    {
                        supPre.PrescriptionId = mr.ExaminationResult.Prescription.PrescriptionId;
                        mr.ExaminationResult.Prescription.SuppliesPrescriptions.Add(supPre);
                    }
                }

                mr.ExaminationResult.Prescription.SuppliesPrescriptions = mr.ExaminationResult.Prescription.SuppliesPrescriptions.Where(x => x.Quantity > 0).ToList();
                //update stock of supplies
                //foreach (var supPre in supplyPrescriptions)
                //{
                //    var supply = await _context.Supplies.FindAsync(supPre.SupplyId);
                //    if (supply is not null)
                //    {
                //        supply.UnitInStock -= (short)supPre.Quantity;
                //    }
                //}
                mr.ExaminationResult.Prescription.Diagnose = diagnose;
                return true;
            }
            
        }
        return false;
    }

    public async Task<List<SuppliesPrescription>> GetSelectedSuppliesByMrIdAsync(int id)
    {
        var mr = await _context.MedicalRecords
            .Where(x => x.MedicalRecordId == id)
            .Include(x => x.ExaminationResult)
            .ThenInclude(x => x!.Prescription)
            .ThenInclude(x => x!.SuppliesPrescriptions!)
            .ThenInclude(x => x!.Supply)
            .FirstOrDefaultAsync();

        if(mr is not null && mr.ExaminationResult is not null && mr.ExaminationResult.Prescription is not null)
        {
            if(mr.ExaminationResult.Prescription.SuppliesPrescriptions == null)
            {
                return new List<SuppliesPrescription>();
            }

            return mr.ExaminationResult.Prescription.SuppliesPrescriptions.ToList();
        }
        else
        {
            return new List<SuppliesPrescription>();
        }
    }
} 