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
    internal class SupplyTypeConfig : IEntityTypeConfiguration<SuppliesType>
    {
        public void Configure(EntityTypeBuilder<SuppliesType> builder)
        {
            builder
                .HasMany(c => c.Supplies)
                .WithOne(c => c.SuppliesType)
                .HasForeignKey(c => c.SuppliesTypeId);
        }
    }
}
