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
    internal class RoleConfig : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {
            builder
                .HasMany(c => c.Users)
                .WithOne(c => c.Role)
                .HasForeignKey(c => c.RoleId);

            builder
                .HasData
                    (
                        new Role()
                        {
                            RoleId = 1,
                            RoleName = "Admin",
                        },
                        new Role()
                        {
                            RoleId = 2,
                            RoleName = "Doctor",
                        },
                        new Role()
                        {
                            RoleId = 3,
                            RoleName = "Cashier",
                        },
                        new Role()
                        {
                            RoleId = 4,
                            RoleName = "Nurse",
                        }
                    );
        }
    }
}
