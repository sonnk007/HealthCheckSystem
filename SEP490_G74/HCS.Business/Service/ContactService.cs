using AutoMapper;
using HCS.Business.RequestModel.ContactRequestModel;
using HCS.Business.ResponseModel.ApiResponse;
using HCS.DataAccess.UnitOfWork;
using HCS.Domain.Models;

namespace HCS.Business.Service;

public interface IContactService
{
    Task<ApiResponse> AddContact(ContactAddModel contactAddModel);
}

public class ContactService : IContactService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ContactService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse> AddContact(ContactAddModel contactAddModel)
    {
        var response = new ApiResponse();

        var contactEntity = _mapper.Map<Contact>(contactAddModel);

        await _unitOfWork.ContactRepo.AddAsync(contactEntity);
        await _unitOfWork.SaveChangeAsync();
        
        return response.SetOk("Created");;
    }
}