using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HCS.Domain.Models
{
    public class ExaminationResult
    {
        public int ExamResultId { get; set; }

        public string Diagnosis { get; set; } = string.Empty;

        public string Conclusion { get; set; } = string.Empty;

        public DateTime ExamDate { get; set; } = DateTime.Now;

        public MedicalRecord MedicalRecord { get; set; }  = null!;

        public int? PrescriptionId { get; set; }

        public Prescription? Prescription { get; set; } = null!;
    }
}
