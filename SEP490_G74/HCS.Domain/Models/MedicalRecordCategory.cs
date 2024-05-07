using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HCS.Domain.Models
{
    public class MedicalRecordCategory
    {
        public int MedicalRecordId { get; set; }

        public MedicalRecord MedicalRecord { get; set; } = null!;

        public int CategoryId { get; set; }

        public Category Category { get; set; } = null!;
    }
}
