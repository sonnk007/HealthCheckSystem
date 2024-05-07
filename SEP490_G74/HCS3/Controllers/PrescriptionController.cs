using HCS.Business.RequestModel.PrescriptionRequestModel;
using HCS.Business.Service;
using HCS.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HCS.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PrescriptionController : ControllerBase
{
    private readonly IPrescriptionService _prescriptionService;

    public PrescriptionController(IPrescriptionService prescriptionService)
    {
        _prescriptionService = prescriptionService;
    }

    [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetPrescription(int id)
    {
        var result = await _prescriptionService.GetPrescription(id);

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
    [HttpGet]
    public async Task<IActionResult> GetPrescriptions()
    {
        var roleClaims = User.Claims
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        //parse to int
        if (roleClaims is not null)
        {
            var userIdString = roleClaims.Value;
            var userId = int.Parse(userIdString);
            var result = await _prescriptionService.GetPrescriptions(userId);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }
        else
        {
            return BadRequest("User not found");
        }
    }

    [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
    [HttpPost]
    public async Task<IActionResult> AddPrescription([FromBody] PrescriptionAddModel prescriptionAddModel)
    {
        var result = await _prescriptionService.AddPrescription(prescriptionAddModel);

        return result.IsSuccess ? Ok(result) : BadRequest(result);

    }

    [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdatePrescription(int id,
        [FromBody] PrescriptionUpdateModel prescriptionUpdateModel)
    {
        var result = await _prescriptionService.UpdatePrescription(id: id, prescriptionUpdateModel);

        return result.IsSuccess ? Ok(result) : NoContent();
    }

    [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
    [HttpDelete("{id:int}")]

    public async Task DeletePrescription(int id)
    {
        await _prescriptionService.DeletePrescription(id);
    } 
}