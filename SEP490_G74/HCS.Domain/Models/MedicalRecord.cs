using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace HCS.Domain.Models
{
    public class MedicalRecord
    {
        public int MedicalRecordId { get; set; }

        public DateTime MedicalRecordDate { get; set; } = DateTime.Now;

        public string ExamReason { get; set; } = string.Empty;

        public bool IsPaid { get; set; } = false;

        public bool IsCheckUp { get; set; } = false;

        public int PatientId { get; set; }

        public Patient? Patient { get; set; } = null!;

        //public ICollection<Invoice>? Invoices { get; set; }

        public int? ExaminationResultId { get; set; }

        public ExaminationResult? ExaminationResult { get; set; }

        public ICollection<MedicalRecordCategory>? MedicalRecordCategories { get; set; }

        public ICollection<ServiceMedicalRecord>? ServiceMedicalRecords { get; set; }

        public ICollection<MedicalRecordDoctor>? MedicalRecordDoctors { get; set; }

        public int? PreviousMedicalRecordId { get; set; }

        public MedicalRecord? PreviousMedicalRecordNavigation { get; set; }

        //==== add new for indexing
        public int Priority { get; set; }
        public int Index { get; set; }
    }
}
