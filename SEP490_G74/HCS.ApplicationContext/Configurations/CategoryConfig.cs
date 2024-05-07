using HCS.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HCS.ApplicationContext.Configurations
{
    internal class CategoryConfig : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder
                .HasMany(c => c.ServiceTypes)
                .WithOne(c => c.Category)
                .HasForeignKey(c => c.CategoryId);

            builder
                .HasData
                    (
                        new Category() { CategoryId = 1, CategoryName = "Khám sơ bộ" },
                        new Category() { CategoryId = 2, CategoryName = "Nội khoa" },
                        new Category() { CategoryId = 3, CategoryName = "Ngoại khoa" }
                    );
        }
    }
}
