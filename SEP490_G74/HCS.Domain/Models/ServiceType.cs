using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HCS.Domain.Models
{
    public class ServiceType
    {
        public int ServiceTypeId { get; set; }

        public string ServiceTypeName { get; set; } = null!;

        public int CategoryId { get; set; }

        public Category? Category { get; set; }

        public bool IsDeleted { get; set; } = false;

        public ICollection<Service> Services { get; set; } = new List<Service>();
    }
}
