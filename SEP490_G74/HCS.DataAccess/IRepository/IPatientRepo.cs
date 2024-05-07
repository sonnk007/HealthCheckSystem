using HCS.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HCS.DataAccess.IRepository
{
    public interface IPatientRepo : IGenericRepo<Patient>
    {
        Task<List<Patient>> GetPatients(int userId);
        Task<Patient?> GetPatientByUserId(int userId);
    }
}
