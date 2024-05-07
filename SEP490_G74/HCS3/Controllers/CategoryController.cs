using HCS.Business.RequestModel.CategoryRequestModel;
using HCS.Business.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HCS.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetCategory(int id)
        {
            var result = await _categoryService.GetCategory(id);

            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var roleClaims = User.Claims
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

            if (roleClaims is not null)
            {
                var userIdString = roleClaims.Value;
                var userId = int.Parse(userIdString);
                var result = await _categoryService.GetCategories(userId);
                return result.IsSuccess ? Ok(result) : BadRequest(result);
            }
            return Unauthorized();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddNewCategory([FromBody] CategoryAddModel category)
        {
            var result = await _categoryService.AddCategory(category);

            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryUpdateModel category)
        {
            var result = await _categoryService.UpdateCategory(id, category);

            return result.IsSuccess ? NoContent() : BadRequest(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task DeleteCategory(int id)
        {
           await _categoryService.DeleteCategory(id);
        }

        [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
        [HttpGet("doctor-category/{id:int}/{mrId:int}")]
        public async Task<IActionResult> GetDoctorCategoryByServiceId(int id, int mrId)
        {
            var result = await _categoryService.GetDoctorCategoryByServiceId(id, mrId);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Admin, Doctor, Nurse, Cashier")]
        [HttpPost("is-default-doctor")]
        public async Task<IActionResult> IsDefaultDoctor()
        {
            var roleClaims = User.Claims
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

            if (roleClaims is not null)
            {
                var userIdString = roleClaims.Value;
                var userId = int.Parse(userIdString);
                var result = await _categoryService.IsDefaultDoctor(userId);
                return result.IsSuccess ? Ok(result) : BadRequest(result);
            }
            return Unauthorized();
        }
    }
}