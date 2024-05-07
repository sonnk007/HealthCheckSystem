using AutoMapper;
using HCS.Business.RequestModel.ExaminationResultRequestModel;
using HCS.Business.ResponseModel.ApiResponse;
using HCS.Business.ResponseModel.ExaminationResultResponseModel;
using HCS.DataAccess.UnitOfWork;
using HCS.Domain.Commons;
using HCS.Domain.Enums;
using HCS.Domain.Models;

namespace HCS.Business.Service;

public interface IExaminationResultService
{
    Task<ApiResponse> AddExaminationResult(ExaminationResultAddModel examinationResultAddModel);
    Task<ApiResponse> GetExaminationResultByMedicalRecordId(int medicalRecordId);
    Task<ApiResponse> GetListExamDetailByMedicalRecordId(int medicalRecordId, int userId);
    Task<ApiResponse> AddExamDetailsByMedicalRecordId(int medicalRecordId, ExaminationDetaislResponseModel examDetails);
    Task<ApiResponse> PayServiceMr(int medicalRecordId, int serviceId);
}
public class ExaminationResultService : IExaminationResultService
{
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;

    public ExaminationResultService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse> AddExaminationResult(ExaminationResultAddModel examinationResultAddModel)
    {
        var response = new ApiResponse();
        
        var medicalRecordEntity =
            await _unitOfWork.MedicalRecordRepo.GetAsync(x =>
                x.MedicalRecordId == examinationResultAddModel.MedicalRecordId);
        
        medicalRecordEntity.ExaminationResult = new ExaminationResult()
        {
            Diagnosis = examinationResultAddModel.Diagnosis,
            Conclusion = examinationResultAddModel.Conclusion
        };

        medicalRecordEntity.IsCheckUp = true;
        
        await _unitOfWork.SaveChangeAsync();

        return response.SetOk("Created");
    }
    
    public async Task<ApiResponse> GetExaminationResultByMedicalRecordId(int medicalRecordId)
    {
        var response = new ApiResponse();

        var medicalRecordEntity =
            await _unitOfWork.MedicalRecordRepo.GetAsync(x => x.MedicalRecordId == medicalRecordId);

        if (medicalRecordEntity == null)
        {
            return response.SetNotFound("Medical Record not found");
        }

        var examEntity =
            await _unitOfWork.ExaminationResultRepo.GetAsync(x =>
                x.ExamResultId == medicalRecordEntity.ExaminationResultId);

        if (examEntity == null)
        {
            return response.SetNotFound("Examination Result not found");
        }

        var exampleResponse = _mapper.Map<ExaminationResultResponseModel>(examEntity);

        return response.SetOk(exampleResponse);
    }

    public async Task<ApiResponse> GetListExamDetailByMedicalRecordId(int medicalRecordId, int userId)
    {
        var response = new ApiResponse();
        var mr = await _unitOfWork.MedicalRecordRepo.GetMrById(medicalRecordId);
        if(mr == null)
        {
            return response.SetNotFound("Medical Record not found");
        }

        if(mr.ServiceMedicalRecords == null)
        {
            return response.SetOk(new ExaminationDetaislResponseModel() { MedicalRecordId = medicalRecordId });
        }

        var details = mr.ServiceMedicalRecords.Select(x => new ExamDetail()
        {
            MedicalRecordId = x.MedicalRecordId,
            ServiceId = x.ServiceId,
            ServiceName = x.Service.ServiceName,
            Description = x.Description,
            Diagnose = x.Diagnose,
            Price = x.Service.Price,
            Status = x.Status ?? false,
            IsPaid = x.IsPaid
        }).ToList();

        var user = await _unitOfWork.UserRepo.GetAsync(x => x.UserId == userId);
        if(user is not null 
            && user.RoleId == (int)UserRole.Doctor
            && user.CategoryId is not null
            && user.CategoryId != DefaultMrOption.DefaultCategoryId)
        {
            var listDetailOfDoctor = new List<ExamDetail>();
            foreach(var detail in details)
            {
                var mrCheckDoc = await _unitOfWork.MedicalRecordRepo.GetMrById(medicalRecordId);
                if(mrCheckDoc is not null && mrCheckDoc.ServiceMedicalRecords is not null)
                {
                    var sm = mrCheckDoc.ServiceMedicalRecords.FirstOrDefault(x => x.ServiceId == detail.ServiceId);
                    if(sm is not null)
                    {
                        if(sm.DoctorId == userId)
                        {
                            listDetailOfDoctor.Add(detail);
                        }
                    }
                }
            }
            details = listDetailOfDoctor;
        }

        return response.SetOk(new ExaminationDetaislResponseModel() { MedicalRecordId = medicalRecordId, ExamDetails = details });
    }

    public async Task<ApiResponse> AddExamDetailsByMedicalRecordId(int medicalRecordId, ExaminationDetaislResponseModel examDetails)
    {
        var mr = await _unitOfWork.MedicalRecordRepo.GetMrById(medicalRecordId);
        if (mr == null)
        {
            return new ApiResponse().SetNotFound("Medical Record not found");
        }

        mr.ServiceMedicalRecords ??= new List<ServiceMedicalRecord>();

        foreach (var detail in examDetails.ExamDetails)
        {
            // check if mr.ServiceMedicalRecords contains detail.ServiceId then update description and diagnose
            var serviceMedicalRecord = mr.ServiceMedicalRecords.FirstOrDefault(x => x.ServiceId == detail.ServiceId);
            if (serviceMedicalRecord != null)
            {
                serviceMedicalRecord.Description = detail.Description;
                serviceMedicalRecord.Diagnose = detail.Diagnose;
                serviceMedicalRecord.Status = true;
            }
        }
        await _unitOfWork.SaveChangeAsync();
        return new ApiResponse().SetOk("Updated");
    }

    public async Task<ApiResponse> PayServiceMr(int medicalRecordId, int serviceId)
    {
        var isPaid = await _unitOfWork.ExaminationResultRepo.PayService(medicalRecordId, serviceId);
        if (isPaid)
        {
            await _unitOfWork.SaveChangeAsync();
            var mrDetail = await _unitOfWork.MedicalRecordRepo.GetMrById(medicalRecordId);
            if (mrDetail is not null)
            {
                var listMr = await _unitOfWork.MedicalRecordRepo.GetAllAsync(null);
                listMr = listMr.OrderBy(x => x.Index).ToList();
                var lastEditMr = listMr.FindLast(x => x.Priority == 0);
                if (lastEditMr is not null)
                {
                    mrDetail.Index = lastEditMr.Index + 1;
                    listMr = listMr.Where(x => x.Index >= mrDetail.Index && x.MedicalRecordId != mrDetail.MedicalRecordId).ToList();
                    for (int i = 0; i < listMr.Count; i++)
                    {
                        var index = i;
                        var highestIndexItem = listMr.OrderByDescending(x => x.Index).FirstOrDefault();
                        if (highestIndexItem is not null)
                        {
                            listMr[index].Index = highestIndexItem.Index + 1;
                        }
                    }
                }
                else
                {
                    var lastMr = listMr.Last();
                    if (lastMr is not null)
                    {
                        mrDetail.Index = lastMr.Index + 1;
                    }
                }
            }
            await _unitOfWork.SaveChangeAsync();
            return new ApiResponse().SetOk("Paid");
        }
        return new ApiResponse().SetNotFound("Not paid");
    }
}