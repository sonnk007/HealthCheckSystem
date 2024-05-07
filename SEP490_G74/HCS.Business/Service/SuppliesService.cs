using AutoMapper;
using HCS.Business.Pagination;
using HCS.Business.RequestModel.SuppliesRequestModel;
using HCS.Business.ResponseModel.ApiResponse;
using HCS.Business.ResponseModel.SuppliesResponseModel;
using HCS.DataAccess.UnitOfWork;
using HCS.Domain.Models;

namespace HCS.Business.Service;

public interface ISuppliesService
{
    Task<ApiResponse> GetSupply(int supplyId);
    Task<ApiResponse> GetSupplies();
    Task<ApiResponse> GetSuppliesBySupplyTypeId(int supplyTypeId);
     Task<ApiResponse> AddSupply(SuppliesAddModel suppliesAddModel);
    Task<ApiResponse> UpdateSupply(int supplyId, SuppliesUpdateModel suppliesUpdateModel);
    Task DeleteSupply(int supplyId);
}
public class SuppliesService : ISuppliesService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public SuppliesService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
    public async Task<ApiResponse> GetSupply(int supplyId)
    {
        var response = new ApiResponse();

        var supplyEntity = await _unitOfWork.SuppliesRepo.GetAsync(x => x.SId == supplyId);

        if (supplyEntity == null)
        {
            return response.SetNotFound("Supply Not found");
        }

        var supplyResponse = _mapper.Map<SuppliesResponseModel>(supplyEntity);
        return response.SetOk(supplyResponse);
    }

    public async Task<ApiResponse> GetSupplies()
    {
        var response = new ApiResponse();

        var suppliesEntity = await _unitOfWork.SuppliesRepo.GetAllAsync(x => true);

        var suppliesResponse = _mapper.Map<List<SuppliesResponseModel>>(suppliesEntity);

        return response.SetOk(suppliesResponse);
    }

    public async Task<ApiResponse> GetSuppliesBySupplyTypeId(int supplyTypeId)
    {
        var response = new ApiResponse();

        var supplyEntity = await _unitOfWork.SuppliesRepo.GetAsync(x => x.SuppliesTypeId == supplyTypeId);

        if (supplyEntity == null)
        {
            return response.SetNotFound("Supply not found");
        }

        var supplyResponse = _mapper.Map<SuppliesResponseModel>(supplyEntity);

        return response.SetOk(supplyResponse);
    }

    public async Task<ApiResponse> AddSupply(SuppliesAddModel suppliesAddModel)
    {
        var response = new ApiResponse();

        var currentsupply = await _unitOfWork.SuppliesRepo.GetAsync(x => x.SName == suppliesAddModel.SName);
        if (currentsupply != null)
        {
            return response.SetBadRequest("Supply Name is already exist");
        }

        var supplyRequest = _mapper.Map<Supply>(suppliesAddModel);

        await _unitOfWork.SuppliesRepo.AddAsync(supplyRequest);
        await _unitOfWork.SaveChangeAsync();

        return response.SetOk("Created");
    }

    public async Task<ApiResponse> UpdateSupply(int supplyId, SuppliesUpdateModel suppliesUpdateModel)
    {
        var response = new ApiResponse();

        var currentEntity = await _unitOfWork.SuppliesRepo.GetAsync(x => x.SId == supplyId);

        if (currentEntity == null)
        {
            return response.SetNotFound("Supply Not Found");
        }

        currentEntity.SName = suppliesUpdateModel.SName;
        currentEntity.Uses = suppliesUpdateModel.Uses;
        currentEntity.Exp = suppliesUpdateModel.Exp;
        currentEntity.Distributor = suppliesUpdateModel.Distributor;
        currentEntity.UnitInStock = suppliesUpdateModel.UnitInStock;
        currentEntity.Price = suppliesUpdateModel.Price;
        currentEntity.Inputday = DateTime.Now;
        currentEntity.SuppliesTypeId = suppliesUpdateModel.SuppliesTypeId;

        await _unitOfWork.SaveChangeAsync();

        return response.SetOk("Updated");
    }

    public async Task DeleteSupply(int supplyId)
    {
        await _unitOfWork.SuppliesRepo.RemoveById(supplyId);
        await _unitOfWork.SaveChangeAsync();
    }
}