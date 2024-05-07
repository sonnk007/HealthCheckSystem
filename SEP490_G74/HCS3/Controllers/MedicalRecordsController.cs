using HCS.Business.RequestModel.MedicalRecordRequestModel;
using HCS.Business.Service;
using HCS.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Security.Claims;

namespace HCS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalRecordsController : ControllerBase
    {
        private readonly IMedicalRecordService _medicalRecordService;

        public MedicalRecordsController(IMedicalRecordService medicalRecordService)
        {
            _medicalRecordService = medicalRecordService;
        }

        [Authorize(Roles = "Admin, Nurse, Doctor")]
        [HttpPost()]
        public async Task<IActionResult> AddMedicalRecord([FromBody] MedicalRecordAddModel medicalRecord)
        {
            var response = await _medicalRecordService.AddMedicalRecord(medicalRecord);

            return response.IsSuccess ? Created($"Medical Record created ", response) : BadRequest(response);
        }

        [Authorize(Roles = "Admin, Nurse, Doctor, Cashier")]
        [HttpGet("id/{patientId:int}")]
        public async Task<IActionResult> GetMedicalRecordByPatientId(
            int patientId,
            [FromQuery] int pageIndex,
            [FromQuery] int pageSize)
        {
            var roleClaims = User.Claims
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            //parse to int
            if (roleClaims is not null)
            {
                var userIdString = roleClaims.Value;
                var userId = int.Parse(userIdString);
                var result = await _medicalRecordService.GetListMrByPatientId(patientId, pageIndex, pageSize, userId);
                return result.IsSuccess ? Ok(result) : BadRequest(result);
            }
            return BadRequest();
        }

        [Authorize(Roles = "Admin, Nurse, Doctor, Cashier")]
        [HttpGet("id/un-check/{patientId:int}")]
        public async Task<IActionResult> GetMedicalRecordUnCheckByPatientId(
            int patientId,
            [FromQuery] int pageIndex,
            [FromQuery] int pageSize)
        {
            var roleClaims = User.Claims
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            //parse to int
            if (roleClaims is not null)
            {
                var userIdString = roleClaims.Value;
                var userId = int.Parse(userIdString);
                var result = await _medicalRecordService.GetListMrUnCheckByPatientId(patientId, pageIndex, pageSize, userId);
                return result.IsSuccess ? Ok(result) : BadRequest(result);
            }
            return BadRequest();
        }

        [Authorize(Roles = "Admin, Nurse, Doctor, Cashier")]
        [HttpGet("id/un-paid/{patientId:int}")]
        public async Task<IActionResult> GetMedicalRecordUnPaidByPatientId(
            int patientId,
            [FromQuery] int pageIndex,
            [FromQuery] int pageSize)
        {
            var roleClaims = User.Claims
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            //parse to int
            if (roleClaims is not null)
            {
                var userIdString = roleClaims.Value;
                var userId = int.Parse(userIdString);
                var result = await _medicalRecordService.GetListMrUnPaidByPatientId(patientId, pageIndex, pageSize, userId);
                return result.IsSuccess ? Ok(result) : BadRequest(result);
            }
            return BadRequest();
        }

        [Authorize(Roles = "Admin, Nurse, Doctor, Cashier")]
        [HttpGet("detail/id/{id:int}")]
        public async Task<IActionResult> GetMedicalRecordById(
            int id)
        {
            // get user id from token
            var roleClaims = User.Claims
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            //parse to int
            if (roleClaims is not null)
            {
                var userIdString = roleClaims.Value;
                var userId = int.Parse(userIdString);
                var result = await _medicalRecordService.GetMrById(id, userId);
                return result.IsSuccess ? Ok(result) : BadRequest(result);
            }
            else
            {
                return BadRequest();
            }
            //var result = await _medicalRecordService.GetMrById(id);

            //return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Admin, Nurse, Cashier")]
        [HttpPatch("payment/id/{id:int}")]
        public async Task<IActionResult> UpdateMrStatusToPaid(
            int id)
        {
            //get user id from token
            var roleClaims = User.Claims
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            //parse to int
            if (roleClaims is not null)
            {
                var userIdString = roleClaims.Value;
                var userId = int.Parse(userIdString);
                var result = await _medicalRecordService.UpdateMrStatus(id, true, userId);
                return result.IsSuccess ? Ok(result) : BadRequest(result);
            }
            else
            {
                return BadRequest();
            }
        }

        [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
        [HttpPatch("check-up/id/{id:int}")]
        public async Task<IActionResult> UpdateMrStatusToCheckUp(
            int id)
        {
            var result = await _medicalRecordService.UpdateMrStatus(id, false, null);

            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Admin, Nurse, Doctor, Cashier")]
        [HttpPatch("id/{id:int}")]
        public async Task<IActionResult> UpdateMedicalRecord(int id, [FromBody] NewMedicalRecordUpdateModel newMedicalRecord)
        {
            var roleClaims = User.Claims
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

            if (roleClaims is not null)
            {
                var userIdString = roleClaims.Value;
                var userId = int.Parse(userIdString);
                var result = await _medicalRecordService.NewUpdateMedicalRecord(userId, id, newMedicalRecord);
                return result.IsSuccess ? Ok(result) : BadRequest(result);
            }
            else
            {
                return BadRequest();
            }
        }

        [Authorize(Roles = "Admin, Nurse, Doctor, Cashier")]
        [HttpGet("recheck-up/id/{id:int}")]
        public async Task<IActionResult> GetRecheckUpMrByPrevMrId(int id)
        {
            var result = await _medicalRecordService.GetReCheckUpMedicalRecordByPreviosMedicalRecordId(id);

            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Admin, Nurse, Doctor, Cashier")]
        [HttpGet("prescription-diagnose/id/{id:int}")]
        public async Task<IActionResult> GetPreDiagnose(int id)
        {
            var result = await _medicalRecordService.GetPrescriptonDiagnoseByMrId(id);

            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Admin, Nurse, Doctor, Cashier")]
        [HttpGet("next-mrs/id/{id:int}")]
        public async Task<IActionResult> GetNextMrIds(int id)
        {
            var result = await _medicalRecordService.GetListNextMrIdsByMrId(id);

            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Admin, Cashier")]
        [HttpPost("pay-prescription/id/{id:int}")]
        public async Task<IActionResult> PayPrescriptionByMrId(int id)
        {
            var result = await _medicalRecordService.PayPrescriptionByMrId(id);

            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }
    }
}
