using HCS.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HCS.Business.RequestModel.MedicalRecordRequestModel
{
    public class MedicalRecordAddModel
    {
        public string ExamReason { get; set; } = string.Empty;

        public List<int> CategoryIds { get; set; } = null!;

        public int PatientId { get; set; }

        public List<int> DoctorIds { get; set; } = null!;

        public int? PreviousMedicalRecordId { get; set; }
    }
}