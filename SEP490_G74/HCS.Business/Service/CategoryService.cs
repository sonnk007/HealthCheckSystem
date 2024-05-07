using AutoMapper;
using HCS.Business.Pagination;
using HCS.Business.RequestModel.CategoryRequestModel;
using HCS.Business.ResponseModel.ApiResponse;
using HCS.Business.ResponseModel.CategoryResponse;
using HCS.DataAccess.Repository;
using HCS.DataAccess.UnitOfWork;
using HCS.Domain.Commons;
using HCS.Domain.Enums;
using HCS.Domain.Models;

namespace HCS.Business.Service;

public interface ICategoryService
{
    Task<ApiResponse> GetCategory(int categoryId);
    Task<ApiResponse> GetCategories(int userId);
    Task<ApiResponse> AddCategory(CategoryAddModel category);
    Task<ApiResponse> UpdateCategory(int categoryId, CategoryUpdateModel category);
    Task DeleteCategory(int categoryId);
    Task<ApiResponse> GetDoctorCategoryByServiceId(int serviceId, int mrId);
    Task<ApiResponse> IsDefaultDoctor(int userId);
}

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse> GetCategory(int categoryId)
    {
        var response = new ApiResponse();

        var category = await _unitOfWork.CategoryRepo.GetAsync(entry => entry.CategoryId == categoryId);

        if (category is null)
        {
             return response.SetNotFound($"Category Not Found With ID {categoryId}");
        }

        var categoryResponse = _mapper.Map<CategoryResponseModel>(category);

        return response.SetOk(categoryResponse);
        
    }

    public async Task<ApiResponse> GetCategories(int userId)
    {
        var response = new ApiResponse();

        var categories = await _unitOfWork.CategoryRepo.GetCategories();

        var user = await _unitOfWork.UserRepo.GetAsync(entry => entry.UserId == userId);

        if(user != null 
            && user.RoleId == (int)UserRole.Doctor 
            && user.CategoryId != null 
            && user.CategoryId != DefaultMrOption.DefaultCategoryId)
        {
            categories = categories.Where(c => c.CategoryId == user.CategoryId).ToList();
        }

        var categoriesResponse = _mapper.Map<List<CategoryResponseModel>>(categories);
        
        return response.SetOk(categoriesResponse);
    }

    public async Task<ApiResponse> AddCategory(CategoryAddModel category)
    {
        var response = new ApiResponse();
        var categoryEntity = _mapper.Map<Category>(category);

        var currentCate = await _unitOfWork.CategoryRepo.GetAsync(entry => entry.CategoryName == category.CategoryName);
        if (currentCate != null) return response.SetBadRequest("Category Name is already exist");

        await _unitOfWork.CategoryRepo.AddAsync(categoryEntity);
        await _unitOfWork.SaveChangeAsync();

        return response.SetOk("Created");
    }

    public async Task<ApiResponse> UpdateCategory(int categoryId, CategoryUpdateModel category)
    {
        var response = new ApiResponse();

        var categoryEntity = await _unitOfWork.CategoryRepo.GetAsync(entry => entry.CategoryId == categoryId);

        if (categoryEntity is null) return response.SetNotFound($"Category Not Found with Id {categoryId}");

        categoryEntity.CategoryName = category.CategoryName;
        await _unitOfWork.SaveChangeAsync();

        return response.SetOk("Updated");
    }

    public async Task DeleteCategory(int categoryId)
    {
        var response = new ApiResponse();

        await _unitOfWork.CategoryRepo.RemoveCategoryById(categoryId);
        await _unitOfWork.SaveChangeAsync();
        
    }

    public async Task<ApiResponse> GetDoctorCategoryByServiceId(int serviceId, int mrId)
    {
        var category = await _unitOfWork.CategoryRepo.GetCategoryByServiceId(serviceId);
        if (category == null) return new ApiResponse().SetNotFound();
        var docsInCate = await _unitOfWork.UserRepo.GetAllDoctorByCategoryIdAsync(category.CategoryId);

        var mr = await _unitOfWork.MedicalRecordRepo.GetMrById(mrId);
        var docInMrWithSameCate = mr?.MedicalRecordDoctors!.Where(x => docsInCate.Select(d => d.UserId).ToList().Contains(x.DoctorId)).ToList();
        if(docInMrWithSameCate == null || docInMrWithSameCate.Count <= 0) return new ApiResponse().SetNotFound();
        
        var result = new DoctorCategoryModel
        {
            CategoryName = category.CategoryName,
            DoctorName = docInMrWithSameCate?.First()?.Doctor?.Contact?.Name??string.Empty
        };

        return new ApiResponse().SetOk(result);
    }

    public async Task<ApiResponse> IsDefaultDoctor(int userId)
    {
        var user = await _unitOfWork.UserRepo.GetAsync(u => u.UserId == userId);
        if(user is not null 
            && user.RoleId == (int)UserRole.Doctor 
            && user.CategoryId is not null 
            && user.CategoryId == DefaultMrOption.DefaultCategoryId)
        {
            return new ApiResponse().SetOk(true);
        }
        return new ApiResponse().SetNotFound(false);
    }
}

class DoctorCategoryModel
{
    public string CategoryName { get; set; } = string.Empty;
    public string DoctorName { get; set; } = string.Empty;
}