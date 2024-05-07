using HCS.Domain.CustomExceptions;
using HCS.ApplicationContext;
using HCS.DataAccess.IRepository;
using HCS.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace HCS.DataAccess.Repository;

public class MedicalRecordRepo : GenericRepo<MedicalRecord>, IMedicalRecordRepo

{
    public MedicalRecordRepo(HCSContext context) : base(context)
    {
    }

    public async Task<MedicalRecord?> GetMrById(int id)
    {
        IQueryable<MedicalRecord> query = _dbSet;
        var mrById = await query
            .Where(med => med!.MedicalRecordId == id)
            .Include(c => c!.MedicalRecordCategories!)
                .ThenInclude(c => c!.Category!)
            .Include(c => c.MedicalRecordDoctors!)
                .ThenInclude(c => c.Doctor!)
                    .ThenInclude(c => c!.Contact)
            .Include(c => c!.ServiceMedicalRecords!)
                .ThenInclude(x => x.Service)
            .FirstOrDefaultAsync();
        return mrById;
    }

    public async Task<MedicalRecord?> GetMrForPrescriptionByMedicalRecordId(int id)
    {
        IQueryable<MedicalRecord> query = _dbSet;

        var medicalRecord = await query.Where(med => med.MedicalRecordId == id)
            .Include(exam => exam.ExaminationResult)
            .ThenInclude(pre => pre.Prescription)
            .ThenInclude(temp => temp.SuppliesPrescriptions)
            .ThenInclude(x => x.Supply)
            .ThenInclude(x => x.SuppliesType)
            .FirstOrDefaultAsync();

        return medicalRecord;
    }

    public Task<List<MedicalRecord>> GetMrByPatientId(int patientId)
    {
        var listMrByPatientId = _context.MedicalRecords
            .Where(med => med.PatientId == patientId)
            .Include(c => c.Patient)
            .ThenInclude(n => n.Contact)
            .ToListAsync();

        return listMrByPatientId;
    }

    public async Task UpdateMrStatusToCheckUp(int mrId)
    {
        var mr = await _context.MedicalRecords.FindAsync(mrId);
        if (mr != null)
        {
            if (mr.IsPaid == false)
                throw new MedicalRecordNotPaidBeforeCheckUpException("Medical record is not paid yet");
            mr.IsCheckUp = true;
        }
    }

    public async Task UpdateMrStatusToPaid(int mrId, int? userId)
    {
        var mr = await _context.MedicalRecords
            .Where(x => x.MedicalRecordId == mrId)
            .Include(x => x.ServiceMedicalRecords!)
            .ThenInclude(x => x.Service)
            .FirstOrDefaultAsync();

        if (mr != null)
        {
            mr.IsPaid = true;

            var newInvoice = new Invoice()
            {
                PatientId = mr.PatientId,
                CashierId = userId ??= 1,
                ServiceMedicalRecords = mr.ServiceMedicalRecords,
                Total = mr.ServiceMedicalRecords != null ? mr.ServiceMedicalRecords.Sum(s => s.IsPaid == true && s.Service != null ? s.Service.Price : 0) : 0,
                Status = true,
                PaymentDate = DateTime.Now,
                PaymentMethod = "Ti?n m?t",
            };

            //if (mr.ServiceMedicalRecords != null)
            //{
            //    foreach (var serviceMedicalRecord in mr.ServiceMedicalRecords)
            //    {
            //        serviceMedicalRecord.IsPaid = true;
            //    }
            //}

            await _context.Invoices.AddAsync(newInvoice);
        }
    }

    public async Task UpdateMrStatusToPaid(int mrId)
    {
        var mr = await _context.MedicalRecords
            .Where(x => x.MedicalRecordId == mrId)
            .Include(x => x.ServiceMedicalRecords!)
            .ThenInclude(x => x.Service)
            .FirstOrDefaultAsync();

        if (mr != null)
        {
            mr.IsPaid = true;
            mr.ServiceMedicalRecords = mr.ServiceMedicalRecords?.Where(x => x.IsPaid == true).ToList();

            var newInvoice = new Invoice()
            {
                PatientId = mr.PatientId,
                CashierId = 1,
                ServiceMedicalRecords = mr.ServiceMedicalRecords,
                Total = mr.ServiceMedicalRecords != null ? mr.ServiceMedicalRecords.Sum(s => s.Service != null ? s.Service.Price : 0) : 0,
                Status = true,
                PaymentDate = DateTime.Now,
                PaymentMethod = "Ti?n m?t",
            };

            if (mr.ServiceMedicalRecords != null)
            {
                foreach (var serviceMedicalRecord in mr.ServiceMedicalRecords)
                {
                    serviceMedicalRecord.Status = true;
                }
            }

            await _context.Invoices.AddAsync(newInvoice);
        }
    }

    public async Task<MedicalRecord?> GetPrescriptionDiagnoseByMrId(int mrId)
    {
        var mr = await _context.MedicalRecords
            .Where(x => x.MedicalRecordId == mrId)
            .Include(x => x.ExaminationResult)
            .ThenInclude(s => s.Prescription)
            .FirstOrDefaultAsync();
        if (mr is not null && mr.ExaminationResult is not null && mr.ExaminationResult.Prescription is not null)
        {
            return mr;
        }
        return null;
    }

    public async Task<List<int>> GetListNextMrIds(int mrId)
    {
        var result = await _context.MedicalRecords
            .Where(x => x.PreviousMedicalRecordId == mrId)
            .Select(x => x.MedicalRecordId)
            .ToListAsync();
        result ??= new List<int>();
        return result;
    }
}