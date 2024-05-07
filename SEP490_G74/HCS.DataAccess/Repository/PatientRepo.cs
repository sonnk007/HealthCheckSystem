using HCS.ApplicationContext;
using HCS.DataAccess.IRepository;
using HCS.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HCS.Domain.Enums;

namespace HCS.DataAccess.Repository
{
    public class PatientRepo : GenericRepo<Patient>, IPatientRepo
    {
        public PatientRepo(HCSContext context) : base(context)
        {
        }

        public async Task<Patient?> GetPatientByUserId(int userId)
        {
            return await _context.Patients
                .Include(c => c.Contact)
                .FirstOrDefaultAsync(e => e.PatientId == userId);
        }

        public async Task<List<Patient>> GetPatients(int userId)
        {
            //Get doctorId by userId from token
            var doctor =await _context.Users.FirstOrDefaultAsync(e => e.UserId == userId);

            if (doctor == null || doctor.UserId < 0) throw new Exception();

            if (doctor.RoleId != 2)
            {
                return await _context.Patients.Include(c => c.Contact).ToListAsync();
            }

            // get list MR doctor assigned
            var medDocs = await _context.MedicalRecordDoctors
                .Where(x => x.DoctorId == doctor.UserId)
                .Select(x => x.MedicalRecordId)
                .ToListAsync();

            // get list patientIds 
            var patientIds = await _context.MedicalRecords
                .Where(x => medDocs.Contains(x.MedicalRecordId))
                .Select(x => x.PatientId)
                .ToListAsync();

            // get list patients that has same categoryID and doctorID with doctor who called api
            var patients = await _context.Patients
                .Where(x => patientIds.Contains(x.PatientId))
                .Include(x => x.Contact)
                .ToListAsync();

            return patients;
        }
    }
}