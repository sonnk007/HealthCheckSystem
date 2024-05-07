using HCS.Domain.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HCS.ApplicationContext.Configurations
{
    internal class PatientConfig : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {

            builder
                .HasMany(c => c.MedicalRecords)
                .WithOne(c => c.Patient)
                .HasForeignKey(c => c.PatientId);

            builder
                .HasOne(c => c.Contact)
                .WithOne(c => c.Patient)
                .HasForeignKey<Patient>(c => c.ContactId);

            builder
                .HasMany(c => c.Invoices)
                .WithOne(c => c.Patient)
                .HasForeignKey(c => c.PatientId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
