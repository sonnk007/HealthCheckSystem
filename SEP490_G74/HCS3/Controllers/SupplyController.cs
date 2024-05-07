using HCS.Business.RequestModel.SuppliesRequestModel;
using HCS.Business.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HCS.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SupplyController : ControllerBase
{
    private readonly ISuppliesService _suppliesService;

    public SupplyController(ISuppliesService suppliesService)
    {
        _suppliesService = suppliesService;
    }

    [Authorize(Roles = "Admin, Doctor, Nurse")]
    [HttpGet("{supplyId:int}")]
    public async Task<IActionResult> GetSupply(int supplyId)
    {
        var result = await _suppliesService.GetSupply(supplyId);

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = "Admin, Doctor, Nurse")]
    [HttpGet("id/{supplyTypeId:int}")]
    public async Task<IActionResult> GetSupplyBySupplyTypeId(int supplyTypeId)
    {
        var result = await _suppliesService.GetSuppliesBySupplyTypeId(supplyTypeId);

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = "Admin, Doctor, Nurse")]
    [HttpGet]
    public async Task<IActionResult> GetSupplies()
    {
        var result = await _suppliesService.GetSupplies();

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = "Admin, Doctor, Nurse")]
    [HttpPost]
    public async Task<IActionResult> AddSupply([FromBody] SuppliesAddModel suppliesAddModel)
    {
        var result = await _suppliesService.AddSupply(suppliesAddModel);
        
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = "Admin, Doctor, Nurse")]
    [HttpPut("{supplyId:int}")]
    public async Task<IActionResult> UpdateSupplies(int supplyId, [FromBody] SuppliesUpdateModel suppliesUpdateModel)
    {
        var result = await _suppliesService.UpdateSupply(supplyId, suppliesUpdateModel);
        
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = "Admin, Doctor, Nurse")]
    [HttpDelete("{supplyId:int}")]
    public async Task<IActionResult> DeleteSupplies(int supplyId)
    {
        await _suppliesService.DeleteSupply(supplyId);
        return Ok("deleted");
    }
}