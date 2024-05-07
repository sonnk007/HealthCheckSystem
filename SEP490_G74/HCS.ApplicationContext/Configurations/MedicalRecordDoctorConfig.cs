using HCS.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HCS.ApplicationContext.Configurations
{
    public class MedicalRecordDoctorConfig : IEntityTypeConfiguration<MedicalRecordDoctor>
    {
        public void Configure(EntityTypeBuilder<MedicalRecordDoctor> builder)
        {
            builder
                .HasOne(c => c.MedicalRecord)
                .WithMany(c => c.MedicalRecordDoctors)
                .HasForeignKey(c => c.MedicalRecordId)
                .OnDelete(DeleteBehavior.NoAction);

            builder
                .HasOne(c => c.Doctor)
                .WithMany(c => c.MedicalRecordDoctors)
                .HasForeignKey(c => c.DoctorId)
                .OnDelete(DeleteBehavior.NoAction);

            builder
                .HasKey(sm => new { sm.DoctorId, sm.MedicalRecordId });
        }
    }
}
