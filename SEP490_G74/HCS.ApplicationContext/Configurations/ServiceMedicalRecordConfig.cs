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
    public class ServiceMedicalRecordConfig : IEntityTypeConfiguration<ServiceMedicalRecord>
    {
        public void Configure(EntityTypeBuilder<ServiceMedicalRecord> builder)
        {
            builder
                .HasOne(c => c.Service)
                .WithMany(c => c.ServiceMedicalRecords)
                .HasForeignKey(c => c.ServiceId);

            builder
                .HasOne(c => c.MedicalRecord)
                .WithMany(c => c.ServiceMedicalRecords)
                .HasForeignKey(c => c.MedicalRecordId);
            
            builder
                .HasKey(sm => new {sm.ServiceId, sm.MedicalRecordId});
        }
    }
}
