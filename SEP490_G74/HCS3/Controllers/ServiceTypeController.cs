using HCS.Business.RequestModel.ServiceTypeRequestModel;
using HCS.Business.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HCS.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ServiceTypeController : ControllerBase
{
    private readonly IServiceTypeService _service;

    public ServiceTypeController(IServiceTypeService service)
    {
        _service = service;
    }

    //[Authorize(Roles = "Admin, Doctor, Nurse")]
    //[HttpGet("{id:int}")]
    //public async Task<IActionResult> GetServiceType(int id)
    //{
    //    var result = await _service.GetServiceType(id);

    //    return result.IsSuccess ? Ok(result) : BadRequest(result);
    //}

    [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetListServiceType(int id)
    {
        var result = await _service.GetListServiceType(id);

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
    [HttpGet("service/{id:int}")]
    public async Task<IActionResult> GetListServiceBySerivceTypeId(int id)
    {
        var result = await _service.GetListServiceByServiceTypeId(id);

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
    [HttpPost]
    public async Task<IActionResult> AddServiceType([FromBody] ServiceTypeAddModel serviceTypeAddModel)
    {
        var result = await _service.AddServiceType(serviceTypeAddModel);

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
    [HttpPost("service")]
    public async Task<IActionResult> AddService([FromBody] ServiceAddModel serviceAddModel)
    {
        var result = await _service.AddService(serviceAddModel);

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateServiceType(int id, [FromBody] ServiceTypeUpdateModel serviceTypeUpdateModel)
    {
        var result = await _service.UpdateServiceType(id, serviceTypeUpdateModel);

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
    [HttpPut("service/{id:int}")]
    public async Task<IActionResult> UpdateService(int id, [FromBody] ServiceUpdateModel serviceUpdateModel)
    {
        var result = await _service.UpdateService(id, serviceUpdateModel);

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteServiceType(int id)
    {
        await _service.DeleteServiceType(id);
        return Ok("deleted");
    }

    [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
    [HttpDelete("service/{id:int}")]
    public async Task<IActionResult> DeleteService(int id)
    {
        await _service.DeleteService(id);
        return Ok("deleted");
    }
}