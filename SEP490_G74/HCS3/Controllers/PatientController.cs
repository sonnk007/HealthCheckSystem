using HCS.Business.RequestModel.PatientRequestModel;
using HCS.Business.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HCS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetPatient(int id)
        {
            var result = await _patientService.GetPatient(id);

            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Admin, Doctor, Nurse")]
        [HttpPost]
        public async Task<IActionResult> AddNewPatient([FromBody] PatientAddModel patient)
        {
            var result = await _patientService.AddPatient(patient);

            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] PatientUpdateModel patient)
        {
            var result = await _patientService.UpdatePatient(id, patient);

            return result.IsSuccess ? NoContent() : BadRequest(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var result = await _patientService.DeletePatient(id);

            return result.IsSuccess ? NoContent() : BadRequest(result);
        }
    }
}