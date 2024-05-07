using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HCS.Business.RequestModel.ExaminationResultRequestModel
{
    public class ExaminationDetaislResponseModel
    {
        public int MedicalRecordId { get; set; }

        public List<ExamDetail> ExamDetails { get; set; } = new List<ExamDetail>();
    }

    public class ExamDetail
    {
        public int MedicalRecordId { get; set; }

        public int ServiceId { get; set; }

        public string ServiceName { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Diagnose { get; set; } = string.Empty;

        public double? Price { get; set; }

        public bool? Status { get; set; }

        public bool IsPaid { get; set; } = false;
    }
}
