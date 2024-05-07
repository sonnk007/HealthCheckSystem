using HCS.ApplicationContext;
using HCS.DataAccess.IRepository;
using HCS.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;

namespace HCS.DataAccess.Repository;

public interface IPrescriptionRepo : IGenericRepo<Prescription>
{
    Task<bool> IsPresSameCategoryWithDoctor(int prescriptionId, int doctorId);
    Task<bool> PayPrescription(int mrId);
}
public class PrescriptionRepo : GenericRepo<Prescription>, IPrescriptionRepo
{
    public PrescriptionRepo(HCSContext context) : base(context)
    {
    }

    public async Task<bool> IsPresSameCategoryWithDoctor(int prescriptionId, int doctorId)
    {
        var doctor = _context.Users.Find(doctorId);
        if(doctor != null)
        {
            var pres = await _context.Prescriptions
                .Include(p => p.ExaminationResult)
                .ThenInclude(e => e.MedicalRecord)
                .ThenInclude(m => m.MedicalRecordCategories)
                .FirstOrDefaultAsync(p => p.PrescriptionId == prescriptionId);

            if(pres != null)
            {
                if(pres.ExaminationResult!.MedicalRecord!.MedicalRecordCategories!.Any(m => m.CategoryId == doctor.CategoryId))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        return false;
    }

    public async Task<bool> PayPrescription(int mrId)
    {
        var mr = await _context.MedicalRecords
            .Where(x => x.MedicalRecordId == mrId)
            .Include(m => m.ExaminationResult)
            .ThenInclude(e => e != null ? e.Prescription : null)
            .ThenInclude(p => p != null ? p.SuppliesPrescriptions : null)
            .FirstOrDefaultAsync();

        if(mr is not null && mr.ExaminationResult is not null && mr.ExaminationResult.Prescription is not null)
        {
            if (mr.ExaminationResult.Prescription.IsPaid == true) return false;
            mr.ExaminationResult.Prescription.IsPaid = true;
            if (mr.ExaminationResult.Prescription.SuppliesPrescriptions is null) return false;
            for(int i = 0; i < mr.ExaminationResult.Prescription.SuppliesPrescriptions.Count; i++)
            {
                //Update available stock
                var supplyPre = mr.ExaminationResult.Prescription.SuppliesPrescriptions.ToList()[i];
                var supply = await _context.Supplies.Where(x => x.SId == supplyPre.SupplyId).FirstOrDefaultAsync();
                if(supply != null)
                {
                    if (supplyPre.Quantity > supply.UnitInStock) return false;
                    supply.UnitInStock -= (short)supplyPre.Quantity;
                    if (supply.UnitInStock < 0) return false;
                }
                else
                {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
}