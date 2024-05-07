using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HCS.Business.RequestModel.ContactRequestModel
{
    public class ContactAddModel
    {
        public string Name { get; set; } = string.Empty;

        public bool Gender { get; set; }

        public string Phone { get; set; } = string.Empty;

        public DateTime Dob { get; set; }

        public string Address { get; set; } = string.Empty;

        public string Img { get; set; } = string.Empty;
        public int PatientId { get; set; }

        public int? UserId { get; set; }
    }
}