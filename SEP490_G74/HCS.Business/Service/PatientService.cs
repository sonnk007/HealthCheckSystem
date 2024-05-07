using AutoMapper;
using HCS.Business.RequestModel.PatientRequestModel;
using HCS.Business.ResponseModel.ApiResponse;
using HCS.Business.ResponseModel.PatientResponseModel;
using HCS.DataAccess.UnitOfWork;
using HCS.Domain.Models;

namespace HCS.Business.Service;

public interface IPatientService
{
    Task<ApiResponse> GetPatient(int patientId);
    Task<ApiResponse> AddPatient(PatientAddModel patient);
    Task<ApiResponse> UpdatePatient(int patientId, PatientUpdateModel patient);
    Task<ApiResponse> DeletePatient(int patientId);
}

public class PatientService : IPatientService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public PatientService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
    public async Task<ApiResponse> GetPatient(int patientId)
    {
        var response = new ApiResponse();
        //var patient = await _unitOfWork.PatientRepo.GetAsync(entry => entry.PatientId == patientId);
        var patient = await _unitOfWork.PatientRepo.GetPatientByUserId(patientId);
        if (patient is null)
        {
            return response.SetNotFound($"Patient Not Found with Id {patientId}");
        }

        var patientResponse = _mapper.Map<PatientResponseModel>(patient);

        return response.SetOk(patientResponse);
    } 
    
  
    public async Task<ApiResponse> AddPatient(PatientAddModel patient)
    {
        var response = new ApiResponse();

        var patientEntity = _mapper.Map<Patient>(patient);

        await _unitOfWork.PatientRepo.AddAsync(patientEntity);
        await _unitOfWork.SaveChangeAsync();

        return response.SetOk("Created");
    }

    public async Task<ApiResponse> UpdatePatient(int patientId, PatientUpdateModel patient)
    {
        var response = new ApiResponse();

        var patientEntity = await _unitOfWork.PatientRepo.GetAsync(entry => entry.PatientId == patientId);
        if (patientEntity is null) return response.SetNotFound($"Patient Not Found with Id {patientId}");

        patientEntity.ServiceDetailName = patient.ServiceDetailName;
        patientEntity.Height = patient.Height;
        patientEntity.Weight = patient.Weight;
        patientEntity.BloodGroup = patient.BloodGroup;
        patientEntity.BloodPressure = patient.BloodPressure;
        patientEntity.Allergieshistory = patient.Allergieshistory;

        await _unitOfWork.SaveChangeAsync();

        return response.SetOk("Updated");
    }   

    public async Task<ApiResponse> DeletePatient(int patientId)
    {
        
        var response = new ApiResponse();

        var patientEntity = await _unitOfWork.PatientRepo.GetAsync(entry => entry.PatientId == patientId);

        if (patientEntity is null) return response.SetNotFound($"Patient Not Found with Id {patientId}");
        
        await _unitOfWork.PatientRepo.RemoveByIdAsync(patientId);
        await _unitOfWork.SaveChangeAsync();
        
        return response.SetOk("Deleted");
    }
}