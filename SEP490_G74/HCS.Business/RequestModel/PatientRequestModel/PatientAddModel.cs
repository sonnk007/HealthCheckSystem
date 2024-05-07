using HCS.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HCS.Business.RequestModel.PatientRequestModel
{
    public class PatientAddModel
    {
        public string ServiceDetailName { get; set; } = null!;

        public byte? Height { get; set; }

        public byte? Weight { get; set; }

        public string? BloodGroup { get; set; }

        public byte? BloodPressure { get; set; }

        public string? Allergieshistory { get; set; }
    }
}