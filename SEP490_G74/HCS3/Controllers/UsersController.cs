using Microsoft.AspNetCore.Mvc;
using HCS.Business.RequestModel.UserRequestModel;
using HCS.Business.RequestModel.PatientRequestModel;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using HCS.Business.RequestModel.ContactRequestModel;
using HCS.Business.RequestModel.PatientContactRequestModel;
using HCS.Business.Service;

namespace HCS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService) 
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequestModel user)
        {
            var loginResponse = await _userService.Login(user);

            if (loginResponse == null || !loginResponse.IsSuccess)
            {
                return BadRequest();
            }

            return Ok(loginResponse);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterModel userRegisterModel)
        {
            var registerResponse = await _userService.RegisterUser(userRegisterModel);

            return registerResponse.IsSuccess ? Ok(registerResponse) : BadRequest(registerResponse);
        }

        [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            if(User.Identity is ClaimsIdentity claimsIdentity)
            {
                var idClaim = claimsIdentity.FindFirst(ClaimTypes.NameIdentifier);

                if(idClaim == null)
                {
                    return BadRequest("Got error when reading claim Id");
                }

                var isUserId = int.TryParse(idClaim.Value, out int userId);

                if (!isUserId) return BadRequest("User ID in Claims is wrong.");

                var loginResponse = await _userService.GetProfile(userId);

                if (loginResponse == null || !loginResponse.IsSuccess)
                {
                    return BadRequest();
                }

                return Ok(loginResponse);

            }

            return BadRequest();
        }

        [Authorize(Roles = "Admin, Nurse, Cashier")]
        [HttpPost("patient-contact")]
        public async Task<IActionResult> AddPatientContact([FromBody] PatientContactRequestModel patientContactRequestModel)
        {
            var result = await _userService.AddPatientContact(patientContactRequestModel);
        
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
        [HttpGet("patients")]
        public async Task<IActionResult> GetPatients([FromQuery] int pageIndex, [FromQuery] int pageSize, [FromQuery] int userId)
        {
            var response = await _userService.GetPatients(pageIndex, pageSize, userId);

            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }

        [Authorize(Roles = "Admin, Nurse, Cashier, Doctor")]
        [HttpGet("doctor/id/{categoryId:int}")]
        public async Task<IActionResult> GetListDoctorByCategoryId(int categoryId)
        {
            var result = await _userService.GetListDoctorByCategoryId(categoryId);

            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Admin, Nurse, Cashier, Doctor")]
        [HttpGet("doctor/least-assigned/id/{categoryId:int}")]
        public async Task<IActionResult> GetLeastAsginedDoctorByCategoryId(int categoryId)
        {
            var result = await _userService.GetLeastAssginedDoctorByCategoryId(categoryId);

            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAccounts()
        {
            var result = await _userService.GetAllAccounts();
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles ="Admin")]
        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles()
        {
            var result = await _userService.GetAllRoles();
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] AccountUpdateModel account)
        {
            var registerResponse = await _userService.UpdateAccount(account);

            return registerResponse.IsSuccess ? Ok(registerResponse) : BadRequest(registerResponse);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var registerResponse = await _userService.RemoveAccount(id);

            return registerResponse.IsSuccess ? Ok(registerResponse) : BadRequest(registerResponse);
        }
    }
}
