using HCS.ApplicationContext;
using HCS.DataAccess.IRepository;
using HCS.DataAccess.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HCS.Domain.Models;

namespace HCS.DataAccess.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly HCSContext _context;

        public IUserRepo UserRepo { get; }

        public IPatientRepo PatientRepo { get; }
        public IContactRepo ContactRepo { get; }
        public IMedicalRecordRepo MedicalRecordRepo { get; }
        public ICategoryRepo CategoryRepo { get; }
        public ISuppliesTypeRepo SuppliesTypeRepo { get; }
        public IPrescriptionRepo PrescriptionRepo { get; }
        public IRoleRepo RoleRepo { get; }
        public IServiceTypeRepo ServiceTypeRepo { get; }
        public IServiceRepo ServiceRepo { get; }
        public IExaminationResultRepo ExaminationResultRepo { get; }
        public ISuppliesRepo SuppliesRepo { get; }
        public ISuppliesPrescriptionRepo SuppliesPrescriptionRepo { get; }

        public UnitOfWork(HCSContext context)
        {
            _context = context;
            UserRepo = new UserRepo(context);
            PatientRepo = new PatientRepo(context);
            ContactRepo = new ContactRepo(context);
            MedicalRecordRepo = new MedicalRecordRepo(context);
            CategoryRepo = new CategoryRepo(context);
            SuppliesTypeRepo = new SuppliesTypeRepo(context);
            PrescriptionRepo = new PrescriptionRepo(context);
            RoleRepo = new RoleRepo(context);
            ServiceTypeRepo = new ServiceTypeRepo(context);
            ServiceRepo = new ServiceRepo(context);
            ExaminationResultRepo = new ExaminationResultRepo(context);
            SuppliesRepo = new SuppliesRepo(context);
            SuppliesPrescriptionRepo = new SuppliesPrescriptionRepo(context);
        }

        public async Task SaveChangeAsync()
        {
          await _context.SaveChangesAsync();
        }
    }
}
