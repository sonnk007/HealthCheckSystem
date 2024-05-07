using HCS.Business.RequestModel.ExaminationResultRequestModel;
using HCS.Business.Service;
using HCS.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HCS.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ExaminationResultController : ControllerBase
{
    private readonly IExaminationResultService _service;
    private readonly IWebHostEnvironment _environment;

    public ExaminationResultController(IExaminationResultService service, IWebHostEnvironment environment)
    {
        _service = service;
        _environment = environment;
    }

    [Authorize(Roles = "Admin, Doctor, Nurse")]
    [HttpPost]
    public async Task<IActionResult> AddExaminationResult(
        [FromBody] ExaminationResultAddModel examinationResultAddModel)
    {
        var result = await _service.AddExaminationResult(examinationResultAddModel);

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
    [HttpGet("id/{medicalRecordId:int}")]
    public async Task<IActionResult> GetExaminationResultByMedicalRecordId(int medicalRecordId)
    {
        var result = await _service.GetExaminationResultByMedicalRecordId(medicalRecordId);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
    [HttpGet("detail/id/{id:int}")]
    public async Task<IActionResult> GetListExamDetailByMedicalRecordId(int id)
    {
        //var result = await _service.GetListExamDetailByMedicalRecordId(id);

        //return result.IsSuccess ? Ok(result) : BadRequest(result);
        var roleClaims = User.Claims
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

        if (roleClaims is not null)
        {
            var userIdString = roleClaims.Value;
            var userId = int.Parse(userIdString);
            var result = await _service.GetListExamDetailByMedicalRecordId(id, userId);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }
        return Unauthorized(); ;
    }

    [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
    [HttpPut("detail/id/{id:int}")]
    public async Task<IActionResult> AddExamDetailByMedicalRecordId(int id, [FromBody] ExaminationDetaislResponseModel examDetails)
    {
        var result = await _service.AddExamDetailsByMedicalRecordId(id, examDetails);

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [AllowAnonymous]
    [HttpPost("upload")]
    public async Task<IActionResult> UploadImage(IFormFile image)
    {
        if (image != null)
        {
            var folderPath = Path.Combine(_environment.ContentRootPath, "Images");
            Directory.CreateDirectory(folderPath); // Create the folder if it doesn't exist

            var fileName = image.FileName;
            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            return Ok(filePath);
        }
        else
        {
            return BadRequest("Please select an image to upload.");
        }
    }

    //create an api to get image by name
    [AllowAnonymous]
    [HttpGet("image/{name}")]
    public IActionResult GetImage(string name)
    {
        var folderPath = Path.Combine(_environment.ContentRootPath, "Images");
        var filePath = Path.Combine(folderPath, name);

        try
        {
            var image = System.IO.File.OpenRead(filePath);
            return File(image, "image/jpeg");
        }
        catch(Exception e)
        {
            return NotFound();
        }
    }

    [Authorize(Roles = "Admin, Cashier")]
    [HttpPatch("detail/pay/mrId/{mrId:int}/serviceId/{serviceId:int}")]
    public async Task<IActionResult> PayServiceMr(int mrId, int serviceId)
    {
        var result = await _service.PayServiceMr(mrId, serviceId);

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

}