using HCS.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HCS.ApplicationContext.Configurations
{
    internal class ContactConfig : IEntityTypeConfiguration<Contact>
    {
        public void Configure(EntityTypeBuilder<Contact> builder)
        {
            builder.HasKey(c => c.CId);

            builder
                .HasData
                    (
                        new Contact() { CId = 1, Name = "Admin Khoa", Address = "Ha Noi", Phone="0987662512" },
                        new Contact() { CId = 2, Name = "Bsi Son", Address = "Ha Noi", Phone = "0987662512" },
                        new Contact() { CId = 3, Name = "Bsi Bang", Address = "Ha Noi", Phone = "0987662512" },
                        new Contact() { CId = 4, Name = "Bsi Tam", Address = "Ha Noi", Phone = "0987662512" },
                        new Contact() { CId = 5, Name = "Bsi Van", Address = "Ha Noi", Phone = "0987662512" },
                        new Contact() { CId = 6, Name = "Y Ta Nho", Address = "Ha Noi", Phone = "0987662512" },
                        new Contact() { CId = 7, Name = "Cashier Trinh", Address = "Ha Noi", Phone = "0987662512" }
                    );
        }
    }
}
