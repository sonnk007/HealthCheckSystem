using HCS.Business.RequestModel.SuppliesPrescriptionRequestModel;
using HCS.Business.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HCS.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SuppliesPrescriptionController :ControllerBase
{
    private readonly ISuppliesPrescriptionService _service;

    public SuppliesPrescriptionController(ISuppliesPrescriptionService service)
    {
        _service = service;
    }

    [Authorize(Roles = "Admin, Doctor, Nurse")]
    [HttpPost]
    public async Task<IActionResult> AddPrescriptionInvoice(
        [FromBody] PrescriptionInvoiceAddModel prescriptionInvoiceAddModel)
    {
        var result = await _service.AddPrescriptionInvoice(prescriptionInvoiceAddModel);

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = "Admin, Doctor, Nurse")]
    [HttpGet("id/{medicalRecordId:int}")]
    public async Task<IActionResult> GetPrescriptionInvoiceByMedicalRecord(int medicalRecordId)
    {
        var result = await _service.GetPrescriptionInvoice(medicalRecordId);

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }
}