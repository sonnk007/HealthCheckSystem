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
    internal class ServiceConfig : IEntityTypeConfiguration<Service>
    {
        public void Configure(EntityTypeBuilder<Service> builder)
        {
            builder
                .HasData(
                    new Service { ServiceId = 1, ServiceName = "Đo chỉ số tổng quát", ServiceTypeId = 1, Price = 100000, IsDeleted = false },
                    
                    new Service { ServiceId = 2, ServiceName = "Chẩn đoán nội soi dạ dày", ServiceTypeId = 2 , Price = 50000 },
                    new Service { ServiceId = 3, ServiceName = "Chẩn đoán nội soi thận", ServiceTypeId = 2 , Price = 70000 },
                    new Service { ServiceId = 4, ServiceName = "Khám nội soi dạ dày", ServiceTypeId = 3, Price = 130000 },
                    new Service { ServiceId = 5, ServiceName = "Khám nội soi thận", ServiceTypeId = 3, Price = 120000 },
                    
                    new Service { ServiceId = 6, ServiceName = "Chẩn đoán ngoại trĩ", ServiceTypeId = 4, Price = 110000 },
                    new Service { ServiceId = 7, ServiceName = "Chẩn đoán ngoại da liễu", ServiceTypeId = 4, Price = 90000 },
                    new Service { ServiceId = 8, ServiceName = "Khám ngoại trĩ", ServiceTypeId = 5, Price = 113000 },
                    new Service { ServiceId = 9, ServiceName = "Khám ngoại da liễu", ServiceTypeId = 5, Price = 40000 }
                );
        }
    }
}
