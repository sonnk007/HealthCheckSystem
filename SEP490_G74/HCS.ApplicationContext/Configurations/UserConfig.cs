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
    public class UserConfig : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {

            builder
                .HasOne(c => c.Contact)
                .WithOne(c => c.User)
                .HasForeignKey<User>(c => c.ContactId);

            builder
                .HasOne(c => c.Category)
                .WithMany(c => c.Doctors)
                .HasForeignKey(c => c.CategoryId);

            builder
                .HasMany(c => c.Invoices)
                .WithOne(c => c.Cashier)
                .HasForeignKey(c => c.CashierId)
                .OnDelete(DeleteBehavior.NoAction);

            builder
                .HasMany(c => c.ServiceMedicalRecords)
                .WithOne(c => c.Doctor)
                .HasForeignKey(c => c.DoctorId)
                .OnDelete(DeleteBehavior.NoAction);

            builder
                .HasData
                    (
                        new User() // Admin
                        {
                            UserId = 1,
                            Email = "vkhoa871@gmail.com",
                            Password = "d0c406e82877aacad00415ca64f821e9",
                            CategoryId = null,
                            Status = true,
                            RoleId = 1,
                            ContactId = 1
                        },
                        new User() // Doctor
                        {
                            UserId = 2,
                            Email = "sonnk1@gmail.com",
                            Password = "d0c406e82877aacad00415ca64f821e9",
                            CategoryId = 1, // Tong quat
                            Status = true,
                            RoleId = 2,
                            ContactId = 2 // Bsi Son
                        },
                        new User() // Doctor
                        {
                            UserId = 3,
                            Email = "doctor3@gmail.com",
                            Password = "d0c406e82877aacad00415ca64f821e9",
                            CategoryId = 2, // Noi khoa
                            Status = true,
                            RoleId = 2,
                            ContactId = 3 // Bsi Banh
                        },
                        new User() // Doctor
                        {
                            UserId = 4,
                            Email = "doctor4@gmail.com",
                            Password = "d0c406e82877aacad00415ca64f821e9",
                            CategoryId = 3, // Ngoại khoa
                            Status = true,
                            RoleId = 2,
                            ContactId = 4 // Bsi Tam
                        },
                        new User() // Doctor
                        {
                            UserId = 5,
                            Email = "doctor5@gmail.com",
                            Password = "d0c406e82877aacad00415ca64f821e9",
                            CategoryId = 3, // Ngoại khoa
                            Status = true,
                            RoleId = 2,
                            ContactId = 5 // Bsi Van
                        },
                        new User()
                        {
                            UserId = 6,
                            Email = "yta1@gmail.com",
                            Password = "d0c406e82877aacad00415ca64f821e9",
                            CategoryId = null,
                            Status = true, // Y ta
                            RoleId = 4,
                            ContactId = 6
                        },
                        new User()
                        {
                            UserId = 7,
                            Email = "cashier1@gmail.com",
                            Password = "d0c406e82877aacad00415ca64f821e9",
                            CategoryId = null,
                            Status = true, // Cashier
                            RoleId = 3,
                            ContactId = 7
                        }
                    );
        }
    } 
}
