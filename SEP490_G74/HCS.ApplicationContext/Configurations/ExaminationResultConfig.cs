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
    internal class ExaminationResultConfig : IEntityTypeConfiguration<ExaminationResult>
    {
        public void Configure(EntityTypeBuilder<ExaminationResult> builder)
        {
            builder
                .HasKey(c => c.ExamResultId);

            builder
                .HasOne(c => c.Prescription)
                .WithOne(c => c.ExaminationResult)
                .HasForeignKey<ExaminationResult>(c => c.PrescriptionId);
        }
    }
}
