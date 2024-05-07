using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HCS.Domain.Models
{
    public class User
    {
        public int UserId { get; set; }

        public string Password { get; set; } = null!;

        public string Email { get; set; } = null!;

        public bool Status { get; set; } = true;

        public int RoleId { get; set; }

        public Role Role { get; set; } = null!;

        public int? CategoryId { get; set; }

        public Category? Category { get; set; } = null;

        public int ContactId { get; set; }

        public Contact? Contact { get; set; }

        public bool IsDeleted { get; set; } = false;

        public ICollection<Invoice>? Invoices { get; set; }

        public ICollection<MedicalRecordDoctor>? MedicalRecordDoctors { get; set; }

        public ICollection<ServiceMedicalRecord>? ServiceMedicalRecords { get; set; }


    }
}
