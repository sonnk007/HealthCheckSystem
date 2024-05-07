using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using HCS.ApplicationContext.Configurations;
using HCS.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace HCS.ApplicationContext
{
    public class HCSContext : DbContext
    {
        public HCSContext(DbContextOptions options) : base(options)
        {
        }

        //Table
        public DbSet<Role> Roles { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<ExaminationResult> ExaminationResults { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<ServiceMedicalRecord> ServiceMedicalRecords { get; set; }
        public DbSet<ServiceType> ServiceTypes { get; set; }
        public DbSet<SuppliesPrescription> SuppliesPrescriptions { get; set; }
        public DbSet<SuppliesType> SuppliesTypes { get; set; }
        public DbSet<Supply> Supplies { get; set; }

        public DbSet<MedicalRecordCategory> MedicalRecordCategories { get; set; }
        public DbSet<MedicalRecordDoctor> MedicalRecordDoctors { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //modelBuilder.Entity<Category>()
            //    .HasQueryFilter(b => !b.IsDeleted);

            //modelBuilder.Entity<Service>()
            //    .HasQueryFilter(b => !b.IsDeleted);

            //modelBuilder.Entity<ServiceType>()
            //    .HasQueryFilter(b => !b.IsDeleted);

            //modelBuilder.Entity<SuppliesType>()
            //    .HasQueryFilter(b => !b.IsDeleted);

            //modelBuilder.Entity<Supply>()
            //    .HasQueryFilter(b => !b.IsDeleted);

            modelBuilder.ApplyConfiguration(new RoleConfig());
            modelBuilder.ApplyConfiguration(new CategoryConfig());
            modelBuilder.ApplyConfiguration(new UserConfig());
            modelBuilder.ApplyConfiguration(new PatientConfig());
            modelBuilder.ApplyConfiguration(new ContactConfig());
            modelBuilder.ApplyConfiguration(new InvoiceConfig());
            modelBuilder.ApplyConfiguration(new MedicalRecordConfig());
            //modelBuilder.ApplyConfiguration(new PrescriptionConfig());
            modelBuilder.ApplyConfiguration(new ServiceMedicalRecordConfig());
            modelBuilder.ApplyConfiguration(new ServiceTypeConfig());
            modelBuilder.ApplyConfiguration(new ServiceConfig());
            modelBuilder.ApplyConfiguration(new SuppliesPrescriptionConfig());
            modelBuilder.ApplyConfiguration(new SupplyTypeConfig());
            modelBuilder.ApplyConfiguration(new ExaminationResultConfig());
            modelBuilder.ApplyConfiguration(new SupplyConfig());

            modelBuilder.ApplyConfiguration(new MedicalRecordCategoryConfig());
            modelBuilder.ApplyConfiguration(new MedicalRecordDoctorConfig());
        }
    }
}