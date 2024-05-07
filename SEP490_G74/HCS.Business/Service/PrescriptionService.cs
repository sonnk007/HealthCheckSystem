using AutoMapper;
using HCS.Business.RequestModel.PrescriptionRequestModel;
using HCS.Business.ResponseModel.ApiResponse;
using HCS.Business.ResponseModel.PrescriptionResponseModel;
using HCS.DataAccess.UnitOfWork;
using HCS.Domain.Enums;
using HCS.Domain.Models;

namespace HCS.Business.Service;

public interface IPrescriptionService
{
    Task<ApiResponse> GetPrescription(int prescriptionId);
    Task<ApiResponse> GetPrescriptions(int userId);
    Task<ApiResponse> AddPrescription(PrescriptionAddModel prescription);
    Task<ApiResponse> UpdatePrescription(int id, PrescriptionUpdateModel prescription);
    Task DeletePrescription(int id);
}
public class PrescriptionService : IPrescriptionService
{
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;

    public PrescriptionService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
    public async Task<ApiResponse> GetPrescription(int prescriptionId)
    {
        var response = new ApiResponse();

        var prescription = await _unitOfWork.PrescriptionRepo.GetAsync(x => x.PrescriptionId == prescriptionId);

        if (prescription is null)
        {
            return response.SetNotFound($"Not Found Prescription with Id {prescriptionId}");
        }

        var prescriptionResponse = _mapper.Map<PrescriptionResponseModel>(prescription);
        return response.SetOk(prescriptionResponse);
    }

    public async Task<ApiResponse> GetPrescriptions(int userId)
    {
        var response = new ApiResponse();
        
        var prescriptions = await _unitOfWork.PrescriptionRepo.GetAllAsync(x => true);

        var prescriptionsResponse = _mapper.Map<List<PrescriptionResponseModel>>(prescriptions);

        var result = new List<PrescriptionResponseModel>();
        var user = await _unitOfWork.UserRepo.GetAsync(x => x.UserId == userId);
        if(user != null)
        {
            if(user.RoleId == (int)UserRole.Doctor)
            {
                foreach(var pres in prescriptionsResponse)
                {
                    var isSameCate = await _unitOfWork.PrescriptionRepo.IsPresSameCategoryWithDoctor(pres.PrescriptionId, userId); 
                    if(isSameCate)
                    {
                        result.Add(pres);
                    }
                }
            }
            else
            {
                return response.SetOk(prescriptionsResponse);
            }
        }
        return response.SetOk(result);
    }

    public async Task<ApiResponse> AddPrescription(PrescriptionAddModel prescription)
    {
        var response = new ApiResponse();

        var prescriptionEntity = _mapper.Map<Prescription>(prescription);

        await _unitOfWork.PrescriptionRepo.AddAsync(prescriptionEntity);
        await _unitOfWork.SaveChangeAsync();

        return response.SetOk("Created");
    }

    public async Task<ApiResponse> UpdatePrescription(int id, PrescriptionUpdateModel prescription)
    {
        var response = new ApiResponse();

        var currentItem = await _unitOfWork.PrescriptionRepo.GetAsync(x => x.PrescriptionId == id);

        if (currentItem is null)
        {
            return response.SetNotFound($"Prescription Not Found with Id {id}");
        }
        
        currentItem.CreateDate = DateTime.Now;
        currentItem.Diagnose = prescription.Diagnose;

        await _unitOfWork.SaveChangeAsync();

        return response.SetOk("Updated");
    }

    public async Task DeletePrescription(int id)
    {
        await _unitOfWork.PrescriptionRepo.RemoveByIdAsync(id);
    }
}