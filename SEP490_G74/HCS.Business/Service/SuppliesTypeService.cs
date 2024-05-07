using AutoMapper;
using HCS.Business.Pagination;
using HCS.Business.RequestModel.SuppliesTypeRequestModel;
using HCS.Business.ResponseModel.ApiResponse;
using HCS.Business.ResponseModel.SuppliesTypeResponseModel;
using HCS.DataAccess.UnitOfWork;
using HCS.Domain.Models;

namespace HCS.Business.Service;

public interface ISuppliesTypeService
{
    Task<ApiResponse> GetSuppliesType(int suppliesTypeId);
    Task<ApiResponse> GetAllSuppliesType();
    Task<ApiResponse> AddSuppliesType(SuppliesTypeAddModel suppliesType);
    Task<ApiResponse> UpdateSuppliesType(int suppliesTypeId, SuppliesTypeUpdateModel suppliesType);
    Task<ApiResponse> DeleteSuppliesType(int suppliesTypeId);
    Task<ApiResponse> GetSuppliesByType(int id);
    Task<ApiResponse> AddSuppliesPrescription(int mrId, SupplyPrescriptionsAddModel supplyPresAddModel);
    Task<ApiResponse> GetSelectedSuppliesByMrId(int mrId);

}

public class SuppliesTypeService : ISuppliesTypeService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public SuppliesTypeService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse> GetSuppliesType(int suppliesTypeId)
    {
        var response = new ApiResponse();

        var suppliesTypeEntity =
            await _unitOfWork.SuppliesTypeRepo.GetAsync(entry => entry.SuppliesTypeId == suppliesTypeId);

        if (suppliesTypeEntity is null)
        {
            return response.SetNotFound($"Supplies Type Not Found with Id {suppliesTypeId}");
        }

        var itemResponse = _mapper.Map<SuppliesTypeResponseModel>(suppliesTypeEntity);
        return response.SetOk(itemResponse);
    }

    public async Task<ApiResponse> GetAllSuppliesType()
    {
        var response = new ApiResponse();
        var items = await _unitOfWork.SuppliesTypeRepo.GetAllAsync(entry => true);

        var itemsResponse = _mapper.Map<List<SuppliesTypeResponseModel>>(items).Paginate(1,5);

        return response.SetOk(itemsResponse);
    }

    public async Task<ApiResponse> AddSuppliesType(SuppliesTypeAddModel suppliesType)
    {
        var response = new ApiResponse();

        var currentSupplyType = await _unitOfWork.SuppliesTypeRepo.GetAsync(entry =>
                   entry.SuppliesTypeName == suppliesType.SuppliesTypeName);
        if (currentSupplyType is not null)
        {
            return response.SetBadRequest("SupplyType Name is already exists");
        }

        var mapSuppliesType = _mapper.Map<SuppliesType>(suppliesType);

        var currentItem =
            await _unitOfWork.SuppliesTypeRepo.GetAsync(entry =>
                entry.SuppliesTypeName == suppliesType.SuppliesTypeName);

        if (currentItem is not null)
        {
            throw new Exception("Supplies Type already existed.");
        }

        await _unitOfWork.SuppliesTypeRepo.AddAsync(mapSuppliesType);
        await _unitOfWork.SaveChangeAsync();

        return response.SetOk("Created");
    }

    public async Task<ApiResponse> UpdateSuppliesType(int suppliesTypeId, SuppliesTypeUpdateModel suppliesType)
    {
        var response = new ApiResponse();

        var currentItem = await _unitOfWork.SuppliesTypeRepo.GetAsync(entry => entry.SuppliesTypeId == suppliesTypeId);

        if (currentItem is null)
        {
            return response.SetNotFound($"Supplies Type Not Found with Id {suppliesTypeId}");
        }

        currentItem.SuppliesTypeName = suppliesType.SuppliesTypeName;
        await _unitOfWork.SaveChangeAsync();

        return response.SetOk("Updated");
    }

    public async Task<ApiResponse> DeleteSuppliesType(int suppliesTypeId)
    {
        var response = new ApiResponse();
        var currentItem = await _unitOfWork.SuppliesTypeRepo.GetAsync(entry => entry.SuppliesTypeId == suppliesTypeId);

        if (currentItem is null)
        {
            return response.SetNotFound($"Supplies Type Not Found with Id {suppliesTypeId}");
        }

        await _unitOfWork.SuppliesTypeRepo.RemoveById(suppliesTypeId);
        await _unitOfWork.SaveChangeAsync();

        return response.SetOk("Deleted");
    }

    public async Task<ApiResponse> GetSuppliesByType(int id)
    {
        var response = new ApiResponse();
        var supplyType = await _unitOfWork.SuppliesTypeRepo.GetSuppliesByTypeAsync(id);
        if(supplyType == null)
        {
            return response.SetNotFound("Supplies Type not found");
        }   

        var supplyTypeResponse = new SuppliesByTypeModel()
        {
            SuppliesTypeId = supplyType.SuppliesTypeId,
            SuppliesTypeName = supplyType.SuppliesTypeName,
            Supplies = supplyType.Supplies.Select(x => new SupplyResponseModel()
            {
                SId = x.SId,
                Distributor = x.Distributor,
                Exp = x.Exp,
                Inputday = x.Inputday,
                Price = x.Price,
                SName = x.SName,
                UnitInStock = x.UnitInStock,
                Uses = x.Uses,
                SuppliesTypeId = x.SuppliesTypeId,
                IsDeleted = x.IsDeleted
            }).ToList()
        };

        return response.SetOk(supplyTypeResponse);
    }

    public async Task<ApiResponse> AddSuppliesPrescription(int mrId, SupplyPrescriptionsAddModel supplyPresAddModel)
    {
        var response = new ApiResponse();
        var supplyPresEntity = new List<SuppliesPrescription>();
        foreach(var supplyPres in supplyPresAddModel.SupplyIds)
        {
            var supplyPreEntity = new SuppliesPrescription()
            {
                SupplyId = supplyPres.SupplyId,
                Quantity = supplyPres.Quantity,
                Dose = supplyPres.Dose,
            };
            supplyPresEntity.Add(supplyPreEntity);
        }
        var isSuccess = await _unitOfWork.SuppliesTypeRepo.AddSuppliesPrescription(mrId, supplyPresEntity, supplyPresAddModel.Diagnose);
        
        response.SetBadRequest("add failed");

        if(isSuccess)
        {
            var existMed = await _unitOfWork.MedicalRecordRepo.GetMrById(mrId);
            if (existMed is null) return new ApiResponse().SetNotFound("Mr Not Found");
            #region Indexing
            existMed.Priority = 0;
            var mrList = await _unitOfWork.MedicalRecordRepo.GetAllAsync(null);
            mrList = mrList.OrderBy(x => x.Index).ToList();
            var lastEditMr = mrList.FindLast(x => x.Priority == 0);
            if (lastEditMr is not null)
            {
                existMed.Index = lastEditMr.Index + 1;
                //move behinds item index + 1
                mrList = mrList.Where(x => x.Index >= existMed.Index && x.MedicalRecordId != existMed.MedicalRecordId).ToList();
                for (int i = 0; i < mrList.Count; i++)
                {
                    var index = i;
                    var highestIndexItem = mrList.OrderByDescending(x => x.Index).FirstOrDefault();
                    if (highestIndexItem is not null)
                    {
                        mrList[index].Index = highestIndexItem.Index + 1;
                    }
                }
            }
            else
            {
                var lastMr = mrList.Last();
                existMed.Index = lastMr.Index + 1;
            }
            #endregion
            await _unitOfWork.SaveChangeAsync();
            response.SetOk("add success");
        }

        return response;
    }

    public async Task<ApiResponse> GetSelectedSuppliesByMrId(int mrId)
    {
        var supplyPresEntities = await _unitOfWork.SuppliesTypeRepo.GetSelectedSuppliesByMrIdAsync(mrId);
        var supplyPresResponse = supplyPresEntities.Select(x => new SupplyPrescriptionResponseModel()
        {
            SupplyId = x.SupplyId,
            SupplyName = x.Supply.SName,
            Quantity = x.Quantity,
            Price = x.Supply.Price,
            Uses = x.Supply.Uses,
            Dose = x.Dose
        }).ToList();
        return new ApiResponse().SetOk(supplyPresResponse);
    }
}