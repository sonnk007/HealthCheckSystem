using HCS.Business.RequestModel.ContactRequestModel;
using HCS.Business.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HCS.API.Controllers;

[Route("api/controller")]
[ApiController]
public class ContactController : ControllerBase
{
    private readonly IContactService _contactService;

    public ContactController(IContactService contactService)
    {
        _contactService = contactService;
    }

    [Authorize(Roles = "Admin, Nurse")]
    [HttpPost]
    public async Task<IActionResult> AddContact([FromBody] ContactAddModel contactAddModel)
    {
        var result = await _contactService.AddContact(contactAddModel);

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }
}