using AutoMapper;
using HCS.Business.RequestModel.ServiceTypeRequestModel;
using HCS.Business.ResponseModel.ApiResponse;
using HCS.Business.ResponseModel.ServiceTypeResponseModel;
using HCS.DataAccess.UnitOfWork;
using HCS.Domain.Models;
using System.Security.Authentication.ExtendedProtection;

namespace HCS.Business.Service;

public interface IServiceTypeService
{
    Task<ApiResponse> GetServiceType(int serviceTypeId);
    Task<ApiResponse> GetListServiceType(int categoryId);
    Task<ApiResponse> AddServiceType(ServiceTypeAddModel serviceTypeAddModel);
    Task<ApiResponse> UpdateServiceType(int serviceTypeId, ServiceTypeUpdateModel serviceTypeUpdateModel);
    Task DeleteServiceType(int serviceTypeId);
    Task<ApiResponse> GetListServiceByServiceTypeId(int serviceTypeId);
    Task<ApiResponse> AddService(ServiceAddModel serviceAddModel);
    Task<ApiResponse> UpdateService(int serviceTypeId, ServiceUpdateModel serviceUpdateModel);
    Task DeleteService(int serviceId);
}
public class ServiceTypeService : IServiceTypeService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ServiceTypeService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
    public async Task<ApiResponse> GetServiceType(int serviceTypeId)
    {
        var response = new ApiResponse();

        var entity = await _unitOfWork.ServiceTypeRepo.GetAsync(x => x.ServiceTypeId == serviceTypeId);

        if (entity is null)
        {
            return response.SetNotFound($"Not Found ServiceType with Id {serviceTypeId}");
        }

        var serviceTypeResponse = _mapper.Map<ServiceTypeResponseModel>(entity);

        return response.SetOk(serviceTypeResponse);
    }

    public async Task<ApiResponse> GetListServiceType(int categoryID)
    {
        var response = new ApiResponse();
        var listEntity = new List<ServiceType>();

        if (categoryID > 0)
        {
            listEntity = await _unitOfWork.ServiceTypeRepo.GetAllAsync(x => x.CategoryId == categoryID);
        }
        else
        {
            listEntity = await _unitOfWork.ServiceTypeRepo.GetAllAsync(null);
        }

        var entityResponse = _mapper.Map<List<ServiceTypeResponseModel>>(listEntity);

        return response.SetOk(entityResponse);
    }

    public async Task<ApiResponse> AddServiceType(ServiceTypeAddModel serviceTypeAddModel)
    {
        var response = new ApiResponse();

        var currentServiceType = await _unitOfWork.ServiceTypeRepo.GetAsync(x => x.ServiceTypeName == serviceTypeAddModel.ServiceTypeName);
        if (currentServiceType is not null) {
            return response.SetBadRequest("Service Type Name is already exist");
        }

        var entity = _mapper.Map<ServiceType>(serviceTypeAddModel);

        await _unitOfWork.ServiceTypeRepo.AddAsync(entity);
        await _unitOfWork.SaveChangeAsync();

        return response.SetOk("Created");
    }

    public async Task<ApiResponse> UpdateServiceType(int serviceTypeId, ServiceTypeUpdateModel serviceTypeUpdateModel)
    {
        var response = new ApiResponse();

        var currentEntity = await _unitOfWork.ServiceTypeRepo.GetAsync(x => x.ServiceTypeId == serviceTypeId);

        if (currentEntity is null)
        {
            return response.SetNotFound($"Not Found ServiceType with Id {serviceTypeId}");
        }

        //_mapper.Map<ServiceType>(serviceTypeUpdateModel);
        currentEntity.ServiceTypeName = serviceTypeUpdateModel.ServiceTypeName;
        await _unitOfWork.SaveChangeAsync();

        return response.SetOk("Updated");
    }

    public async Task<ApiResponse> UpdateService(int serviceId, ServiceUpdateModel serviceUpdateModel)
    {
        var response = new ApiResponse();

        var currentEntity = await _unitOfWork.ServiceRepo.GetAsync(x => x.ServiceId == serviceId);

        if (currentEntity is null)
        {
            return response.SetNotFound($"Not Found ServiceType with Id {serviceId}");
        }

        //_mapper.Map<ServiceType>(serviceTypeUpdateModel);
        currentEntity.ServiceName = serviceUpdateModel.ServiceName;
        currentEntity.Price = serviceUpdateModel.Price;
        await _unitOfWork.SaveChangeAsync();

        return response.SetOk("Updated");
    }

    public async Task<ApiResponse> AddService(ServiceAddModel serviceAddModel)
    {
        var response = new ApiResponse();

        var currentService = await _unitOfWork.ServiceRepo.GetAsync(x => x.ServiceName == serviceAddModel.ServiceName);
        if (currentService is not null)
        {
            return response.SetBadRequest("Service Name is already exist");
        }

        //var entity = _mapper.Map<ServiceType>(serviceTypeAddModel);
        var entity = new HCS.Domain.Models.Service()
        {
            ServiceName = serviceAddModel.ServiceName,
            ServiceTypeId = serviceAddModel.ServiceTypeId,
            Price = serviceAddModel.Price
        };

        await _unitOfWork.ServiceRepo.AddAsync(entity);
        await _unitOfWork.SaveChangeAsync();

        return response.SetOk("Created");
    }

    public async Task DeleteServiceType(int serviceTypeId)
    {
        await _unitOfWork.ServiceTypeRepo.RemoveById(serviceTypeId);
        await _unitOfWork.SaveChangeAsync();
    }

    public async Task DeleteService(int serviceId)
    {
        await _unitOfWork.ServiceRepo.RemoveById(serviceId);
        await _unitOfWork.SaveChangeAsync();
    }

    public async Task<ApiResponse> GetListServiceByServiceTypeId(int serviceTypeId)
    {
        var response = new ApiResponse();
        var services = new List<HCS.Domain.Models.Service>();
        if(serviceTypeId > 0)
        {
            services = await _unitOfWork.ServiceRepo.GetAllAsync(x => x.ServiceTypeId == serviceTypeId);
        }
        else
        {
            services = await _unitOfWork.ServiceRepo.GetAllAsync(null);
        }
        var servicesResponse = _mapper.Map<List<ServiceResponseModel>>(services);
        return response.SetOk(servicesResponse);
    }
}