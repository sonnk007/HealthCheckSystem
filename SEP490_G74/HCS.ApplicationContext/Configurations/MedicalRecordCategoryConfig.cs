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
    public class MedicalRecordCategoryConfig : IEntityTypeConfiguration<MedicalRecordCategory>
    {
        public void Configure(EntityTypeBuilder<MedicalRecordCategory> builder)
        {
            builder
                .HasOne(c => c.Category)
                .WithMany(c => c.MedicalRecordCategories)
                .HasForeignKey(c => c.CategoryId);

            builder
                .HasOne(c => c.MedicalRecord)
                .WithMany(c => c.MedicalRecordCategories)
                .HasForeignKey(c => c.MedicalRecordId);

            builder
                .HasKey(sm => new { sm.CategoryId, sm.MedicalRecordId });
        }
    }
}
