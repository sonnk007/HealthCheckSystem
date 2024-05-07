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
    internal class SuppliesPrescriptionConfig : IEntityTypeConfiguration<SuppliesPrescription>
    {
        public void Configure(EntityTypeBuilder<SuppliesPrescription> builder)
        {
            builder
                .HasOne(c => c.Supply)
                .WithMany(c => c.SuppliesPrescriptions)
                .HasForeignKey(c => c.SupplyId);

            builder
                .HasOne(c => c.Prescription)
                .WithMany(c => c.SuppliesPrescriptions)
                .HasForeignKey(c => c.PrescriptionId);

            builder
                .HasKey(c => c.SId);
        }
    }
}
