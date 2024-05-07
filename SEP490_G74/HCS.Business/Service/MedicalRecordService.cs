using AutoMapper;
using HCS.Business.Pagination;
using HCS.Business.RequestModel.MedicalRecordRequestModel;
using HCS.Business.ResponseModel.ApiResponse;
using HCS.Business.ResponseModel.CategoryResponse;
using HCS.Business.ResponseModel.ExaminationResultResponseModel;
using HCS.Business.ResponseModel.MedicalRecordResponseModel;
using HCS.DataAccess.UnitOfWork;
using HCS.Domain.Commons;
using HCS.Domain.Enums;
using HCS.Domain.Models;
using Microsoft.Extensions.Logging.Abstractions;
using System.Collections;
using System.Collections.Generic;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace HCS.Business.Service;
public interface IMedicalRecordService
{
    Task<ApiResponse> AddMedicalRecord(MedicalRecordAddModel medicalRecord);
    Task<ApiResponse> UpdateMedicalRecord(int mrId, MedicalRecordUpdateModel medicalRecordUpdateModel);

    Task<ApiResponse> GetListMrByPatientId(int patientId, int pageIndex, int pageSize, int userId);
    Task<ApiResponse> GetMrById(int id, int userId);
    Task<ApiResponse> UpdateMrStatus(int mrId, bool isPaid, int? userId);
    Task<ApiResponse> NewUpdateMedicalRecord(int userId, int id, NewMedicalRecordUpdateModel newMedicalRecord);
    Task<ApiResponse> GetReCheckUpMedicalRecordByPreviosMedicalRecordId(int prevMrId);
    Task<ApiResponse> GetListMrUnCheckByPatientId(int patientId, int pageIndex, int pageSize, int userId);
    Task<ApiResponse> GetListMrUnPaidByPatientId(int patientId, int pageIndex, int pageSize, int userId);
    Task<ApiResponse> GetPrescriptonDiagnoseByMrId(int mrId);
    Task<ApiResponse> GetListNextMrIdsByMrId(int mrId);
    Task<ApiResponse> PayPrescriptionByMrId(int mrId);

}
public class MedicalRecordService : IMedicalRecordService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public MedicalRecordService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
    public async Task<ApiResponse> AddMedicalRecord(MedicalRecordAddModel medicalRecord)
    {
        var response = new ApiResponse();
        var medicalRecordEntity = new MedicalRecord()
        {
            MedicalRecordDate = DateTime.Now,
            ExamReason = medicalRecord.ExamReason,
            PatientId = medicalRecord.PatientId,
            IsCheckUp = false,
            IsPaid = false
        };

        if (medicalRecord.PreviousMedicalRecordId != null && medicalRecord.PreviousMedicalRecordId > 0)
        {
            medicalRecordEntity.PreviousMedicalRecordId = medicalRecord.PreviousMedicalRecordId;
        }

        if (medicalRecord.CategoryIds == null || medicalRecord.CategoryIds.Count == 0 || !medicalRecord.CategoryIds.Any(c => c == DefaultMrOption.DefaultCategoryId))
        {
            medicalRecord.CategoryIds ??= new List<int>();
            medicalRecord.CategoryIds.Add(DefaultMrOption.DefaultCategoryId);
        }


        medicalRecordEntity.MedicalRecordCategories = medicalRecord.CategoryIds.Select(
            c => new MedicalRecordCategory()
            {
                CategoryId = c
            }).ToList();

        //if (medicalRecord.DoctorIds == null || medicalRecord.DoctorIds.Count == 0 || !medicalRecord.DoctorIds.Any(c => c == DefaultMrOption.DefaultDoctorId))
        //{
        //    medicalRecord.DoctorIds ??= new List<int>();
        //    medicalRecord.DoctorIds.Add(DefaultMrOption.DefaultDoctorId);
        //}

        medicalRecordEntity.MedicalRecordDoctors = medicalRecord.DoctorIds.Select(
            d => new MedicalRecordDoctor()
            {
                DoctorId = d
            }).ToList();

        var docs = new List<User>();

        foreach (var docId in medicalRecord.DoctorIds)
        {
            var doc = await _unitOfWork.UserRepo.GetAsync(x => x.UserId == docId);
            if (doc is not null && doc.CategoryId is not null)
            {
                docs.Add(doc);
            }
        }

        var selectedDefaultDoctor = docs.Where(d => d.CategoryId == DefaultMrOption.DefaultCategoryId).FirstOrDefault();
        if (selectedDefaultDoctor is null)
        {
            return new ApiResponse().SetNotFound("Not Found Default Doctor");
        }

        ServiceMedicalRecord defaultService = new()
        {
            ServiceId = DefaultMrOption.DefaultServiceId,
            DoctorId = selectedDefaultDoctor.UserId,
            MedicalRecord = medicalRecordEntity
        };

        medicalRecordEntity.ServiceMedicalRecords ??= new List<ServiceMedicalRecord>();
        medicalRecordEntity.ServiceMedicalRecords.Add(defaultService);

        #region Indexing

        medicalRecordEntity.Priority = 1;
        medicalRecordEntity.Index = 0;

        var mrList = await _unitOfWork.MedicalRecordRepo.GetAllAsync(null);
        var lastMr = mrList.OrderByDescending(x => x.Index).FirstOrDefault();
        if (lastMr is not null)
        {
            medicalRecordEntity.Index = lastMr.Index + 1;
        }

        #endregion

        await _unitOfWork.MedicalRecordRepo.AddAsync(medicalRecordEntity);
        await _unitOfWork.SaveChangeAsync();

        response = new ApiResponse();
        response.SetOk("Created");

        return response;
    }

    public async Task<ApiResponse> UpdateMedicalRecord(int mrId, MedicalRecordUpdateModel medicalRecordUpdateModel)
    {
        var response = new ApiResponse();

        var currentMr = await _unitOfWork.MedicalRecordRepo.GetAsync(x => x.MedicalRecordId == mrId);

        if (currentMr is null)
        {
            return response.SetNotFound($"Not Found with Id {mrId}");
        }

        currentMr.MedicalRecordDate = medicalRecordUpdateModel.MedicalRecordDate;
        currentMr.ExamReason = medicalRecordUpdateModel.ExamReason;
        //currentMr.ExamCode = medicalRecordUpdateModel.ExamCode;

        await _unitOfWork.SaveChangeAsync();

        return response.SetOk("Updated");
    }

    public async Task<ApiResponse> GetListMrByPatientId(int patientId, int pageIndex, int pageSize, int userId)
    {
        var response = new ApiResponse();

        var listItem = await _unitOfWork.MedicalRecordRepo.GetAllAsync(x => x.PatientId == patientId);

        if (patientId == 0)
        {
            listItem = await _unitOfWork.MedicalRecordRepo.GetAllAsync(null);
            listItem = await GetListMedicalRecordsByRole(userId, listItem);
        }

        var listItemResponse = new List<MrResponseByPatientId>();

        foreach (var item in listItem)
        {
            var contact = await _unitOfWork.ContactRepo.GetAsync(x => x.Patient!.PatientId == item.PatientId);

            //var category = await _unitOfWork.CategoryRepo.GetAsync(x => x.CategoryId == item.CategoryId);
            var result = new MrResponseByPatientId()
            {
                MedicalRecordId = item.MedicalRecordId,
                MedicalRecordDate = item.MedicalRecordDate,
                Name = contact.Name,
                //CategoryName = category.CategoryName,
                IsCheckUp = item.IsCheckUp,
                IsPaid = item.IsPaid,
                PatientId = item.PatientId
            };

            listItemResponse.Add(result);
        }

        // order list by date
        listItemResponse = listItemResponse.OrderBy(x => x.MedicalRecordDate).ToList();
        var paginationResult = listItemResponse.Paginate(pageIndex, pageSize);
        return response.SetOk(paginationResult);
    }

    public async Task<ApiResponse> GetListMrUnCheckByPatientId(int patientId, int pageIndex, int pageSize, int userId)
    {
        var response = new ApiResponse();

        var listItem = await _unitOfWork.MedicalRecordRepo.GetAllAsync(x => x.PatientId == patientId);

        if (patientId == 0)
        {
            listItem = await _unitOfWork.MedicalRecordRepo.GetAllAsync(null);
            listItem = await GetListMedicalRecordsByRole(userId, listItem);
        }

        var listItemResponse = new List<MrResponseByPatientId>();

        foreach (var item in listItem)
        {
            var contact = await _unitOfWork.ContactRepo.GetAsync(x => x.Patient!.PatientId == item.PatientId);

            //var category = await _unitOfWork.CategoryRepo.GetAsync(x => x.CategoryId == item.CategoryId);
            var result = new MrResponseByPatientId()
            {
                MedicalRecordId = item.MedicalRecordId,
                MedicalRecordDate = item.MedicalRecordDate,
                Name = contact.Name,
                //CategoryName = category.CategoryName,
                IsCheckUp = item.IsCheckUp,
                IsPaid = item.IsPaid,
                PatientId = item.PatientId
            };

            listItemResponse.Add(result);
        }
        listItemResponse = listItemResponse.Where(x => x.IsCheckUp == false).ToList();

        foreach (var item in listItemResponse)
        {
            var mrCheckDetail = await _unitOfWork.MedicalRecordRepo.GetMrById(item.MedicalRecordId);
            if (mrCheckDetail is not null && mrCheckDetail.ServiceMedicalRecords is not null)
            {
                string status = MedicalRecordStatus.NOT_CHECK_UP;
                var servicesByRole = mrCheckDetail.ServiceMedicalRecords.Where(m => m.DoctorId == userId).ToList();
                var countServicesCheckUp = servicesByRole.Count(s => s.Status == true);

                if (countServicesCheckUp > 0 && countServicesCheckUp < servicesByRole.Count)
                {
                    status = MedicalRecordStatus.CHECKING_UP;
                }
                else if (countServicesCheckUp == servicesByRole.Count)
                {
                    status = MedicalRecordStatus.CHECKED_UP;
                }
                item.IsCheckUpCompleted = status;
            }
        }

        // order list by date
        listItemResponse = listItemResponse.OrderBy(x => x.MedicalRecordDate).ToList();
        var paginationResult = listItemResponse.Paginate(pageIndex, pageSize);
        return response.SetOk(paginationResult);
    }

    public async Task<ApiResponse> GetListMrUnPaidByPatientId(int patientId, int pageIndex, int pageSize, int userId)
    {
        var response = new ApiResponse();

        var listItem = await _unitOfWork.MedicalRecordRepo.GetAllAsync(x => x.PatientId == patientId);

        if (patientId == 0)
        {
            listItem = await _unitOfWork.MedicalRecordRepo.GetAllAsync(null);
            listItem = await GetListMedicalRecordsByRole(userId, listItem);
        }

        var listItemResponse = new List<MrResponseByPatientId>();

        foreach (var item in listItem)
        {
            var contact = await _unitOfWork.ContactRepo.GetAsync(x => x.Patient!.PatientId == item.PatientId);

            //var category = await _unitOfWork.CategoryRepo.GetAsync(x => x.CategoryId == item.CategoryId);
            var result = new MrResponseByPatientId()
            {
                MedicalRecordId = item.MedicalRecordId,
                MedicalRecordDate = item.MedicalRecordDate,
                Name = contact.Name,
                //CategoryName = category.CategoryName,
                IsCheckUp = item.IsCheckUp,
                IsPaid = item.IsPaid,
                PatientId = item.PatientId,
                Index = item.Index,
                Priority = item.Priority
            };

            listItemResponse.Add(result);
        }
        listItemResponse = listItemResponse.Where(x => x.IsPaid == false).ToList();

        foreach (var item in listItemResponse.ToList())
        {
            var mrDetail = await _unitOfWork.MedicalRecordRepo.GetMrById(item.MedicalRecordId);
            if (mrDetail is not null && mrDetail.ServiceMedicalRecords is not null)
            {
                // neu ho so co dich vu can thanh toan = 0 hoac ho so da thanh toan => xoa ho so
                if (mrDetail.ServiceMedicalRecords.Count(x => x.IsPaid) == mrDetail.ServiceMedicalRecords.Count
                    || mrDetail.IsPaid == true)
                {
                    var checkPreMr = await _unitOfWork.MedicalRecordRepo.GetMrForPrescriptionByMedicalRecordId(mrDetail.MedicalRecordId);
                    if (checkPreMr is null) return new ApiResponse().SetNotFound("Mr not found");
                    // neu ho so khong co don thuoc => xoa
                    if (checkPreMr.ExaminationResult is null || checkPreMr.ExaminationResult.Prescription is null)
                    {
                        listItemResponse.Remove(item);
                    }
                    else // neu ho so co don thuoc
                    {
                        // neu don thuoc da thanh toan => xoa
                        if (checkPreMr.ExaminationResult.Prescription.IsPaid == true)
                        {
                            listItemResponse.Remove(item);
                        }
                        // neu ho so khong co dich vu can thanh toan nhung co don thuoc can thanh toan => ko xoa
                    }
                }
            }
        }
        // order list by date
        //listItemResponse = listItemResponse.OrderByDescending(x => x.Priority).ToList();
        listItemResponse = listItemResponse.OrderBy(x => x.Index).ToList();
        var paginationResult = listItemResponse.Paginate(pageIndex, pageSize);
        return response.SetOk(paginationResult);
    }

    public async Task<ApiResponse> GetMrById(int id, int userId)
    {
        var mrById = await _unitOfWork.MedicalRecordRepo.GetMrById(id);
        if (mrById is null)
        {
            return new ApiResponse().SetNotFound($"Not Found with Id {id}");
        }
        var mrByIdResponse = new MedicalRecordDetailResponseModel()
        {
            MedicalRecordId = mrById.MedicalRecordId,
            MedicalRecordDate = mrById.MedicalRecordDate,
            ExamReason = mrById.ExamReason,
            ExamCode = mrById.ExamReason,
            PatientId = mrById.PatientId,
            PrevMedicalRecordId = mrById.PreviousMedicalRecordId,
            Categories = mrById.MedicalRecordCategories!.Select(
                               c => new CategoryResponseModel()
                               {
                                   CategoryId = c.CategoryId,
                                   CategoryName = c.Category.CategoryName,
                                   IsDeleted = c.Category.IsDeleted

                               }
                                              ).ToList(),
            Doctors = mrById.MedicalRecordDoctors!.Select(
                               d => new DoctorResponseModel()
                               {
                                   DoctorId = d.DoctorId,
                                   DoctorName = d.Doctor.Contact != null ? d.Doctor.Contact.Name : string.Empty,
                                   CategoryId = d.Doctor.CategoryId ?? 0,
                                   IsDeleted = d.Doctor.IsDeleted
                               }
                                                                            ).ToList(),
            IsPaid = mrById.IsPaid,
            IsCheckUp = mrById.IsCheckUp,
        };
        // get serviceTypes
        if (mrById.ServiceMedicalRecords is not null)
        {
            // get selected serviceTypes
            var typeIds = mrById.ServiceMedicalRecords.Select(x => x.Service.ServiceTypeId).Distinct();
            foreach (var typeId in typeIds)
            {
                var typeEntity = await _unitOfWork.ServiceTypeRepo.GetAsync(x => x.ServiceTypeId == typeId);
                if (typeEntity != null)
                {
                    var servicesByTyped = mrById.ServiceMedicalRecords.Where(x => x.Service.ServiceTypeId == typeId).Select(x => x.Service).ToList();
                    mrByIdResponse.ServiceTypes.Add(new ServiceTypeDetailResponseModel()
                    {
                        ServiceTypeId = typeEntity.ServiceTypeId,
                        ServiceTypeName = typeEntity.ServiceTypeName,
                        IsDeleted = typeEntity.IsDeleted,
                        Services = servicesByTyped.Select(x => new ServiceResponseDetailModel()
                        {
                            ServiceId = x.ServiceId,
                            ServiceName = x.ServiceName,
                            Price = x.Price,
                            ServiceTypeId = x.ServiceTypeId,
                            IsDeleted = x.IsDeleted,
                            DoctorId = mrById.ServiceMedicalRecords.Where(s => s.ServiceId == x.ServiceId && s.MedicalRecordId == mrById.MedicalRecordId).Select(s => s.DoctorId).FirstOrDefault(),
                            //DoctorName = mrById.ServiceMedicalRecords.Where(s => s.ServiceId == x.ServiceId && s.MedicalRecordId == mrById.MedicalRecordId).Select(s => s.Doctor.Contact?.Name).FirstOrDefault() ?? "Không có bác s?"
                        }).ToList()
                    });
                }
            }

            foreach (var type in mrByIdResponse.ServiceTypes)
            {
                foreach (var service in type.Services)
                {
                    var doctor = await _unitOfWork.UserRepo.GetAsync(x => x.UserId == service.DoctorId);
                    if (doctor is not null)
                    {
                        var contact = await _unitOfWork.UserRepo.GetProfile(doctor.Email);
                        if (contact is not null)
                        {
                            service.DoctorName = contact.UserName;
                        }
                    }
                }
            }
        }

        // check if role is doctor => filter mrById list categories, service types, service by doctorId
        //if (userId > 0 && userId != DefaultMrOption.DefaultDoctorId)
        //{
        //    var user = await _unitOfWork.UserRepo.GetAsync(u => u.UserId == userId);
        //    if (user != null)
        //    {
        //        if (user.RoleId == (int)UserRole.Doctor)
        //        {
        //            // filter only doctor call api
        //            mrById.MedicalRecordDoctors = mrById.MedicalRecordDoctors?.Where(x => x.DoctorId == userId).ToList();

        //            if (mrById.MedicalRecordDoctors != null)
        //            {
        //                mrByIdResponse.Doctors = mrById.MedicalRecordDoctors.Select(x => new DoctorResponseModel()
        //                {
        //                    DoctorId = x.DoctorId,
        //                    DoctorName = x.Doctor.Contact != null ? x.Doctor.Contact.Name : string.Empty,
        //                    CategoryId = x.Doctor.CategoryId ?? 0
        //                }).ToList();
        //            }

        //            // filter category
        //            mrById.MedicalRecordCategories = mrById.MedicalRecordCategories?.Where(x => x.CategoryId == user.CategoryId).ToList();

        //            if (mrById.MedicalRecordCategories != null)
        //            {
        //                mrByIdResponse.Categories = mrById.MedicalRecordCategories.Select(x => new CategoryResponseModel()
        //                {
        //                    CategoryId = x.CategoryId,
        //                    CategoryName = x.Category.CategoryName
        //                }).ToList();
        //            }

        //            List<int> listCateIds = mrById.MedicalRecordCategories?.Select(x => x.CategoryId).ToList() ?? new List<int>();
        //            // filter service type
        //            if (mrById.ServiceMedicalRecords is not null)
        //            {
        //                // get list types in mr that have same categoryId with user
        //                var listServiceTypeIds = mrById.ServiceMedicalRecords
        //                    .Where(x => x.Service.ServiceType.CategoryId == user.CategoryId)
        //                    .Select(x => x.Service.ServiceTypeId)
        //                    .Distinct()
        //                    .ToList();
        //                // get all type from db then filter by list type ids
        //                var types = await _unitOfWork.ServiceTypeRepo.GetAllAsync(null);
        //                types = types.Where(t => listServiceTypeIds.Contains(t.ServiceTypeId)).ToList();

        //                mrByIdResponse.ServiceTypes = types.Select(x => new ServiceTypeDetailResponseModel()
        //                {
        //                    ServiceTypeId = x.ServiceTypeId,
        //                    ServiceTypeName = x.ServiceTypeName,
        //                    Services = new List<ServiceResponseDetailModel>()
        //                }).ToList();

        //                foreach (var serviceType in mrByIdResponse.ServiceTypes)
        //                {
        //                    serviceType.Services = mrById.ServiceMedicalRecords
        //                        .Where(x => x.Service.ServiceTypeId == serviceType.ServiceTypeId)
        //                        .Select(x => new ServiceResponseDetailModel()
        //                        {
        //                            ServiceId = x.Service.ServiceId,
        //                            ServiceName = x.Service.ServiceName,
        //                            Price = x.Service.Price,
        //                            ServiceTypeId = x.Service.ServiceTypeId,
        //                            IsDeleted = x.Service.IsDeleted,

        //                        }).ToList();
        //                }
        //            }
        //        }
        //    }
        //}
        return new ApiResponse().SetOk(mrByIdResponse);
    }

    public async Task<ApiResponse> UpdateMrStatus(int mrId, bool isPaid, int? userId)
    {
        switch (isPaid)
        {
            case true:
                {
                    await _unitOfWork.MedicalRecordRepo.UpdateMrStatusToPaid(mrId, userId);
                    await _unitOfWork.SaveChangeAsync();
                    var mrDetail = await _unitOfWork.MedicalRecordRepo.GetMrById(mrId);
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
                    break;
                }
            case false:
                {
                    await _unitOfWork.MedicalRecordRepo.UpdateMrStatusToCheckUp(mrId);
                    break;
                }
        }
        await _unitOfWork.SaveChangeAsync();
        return new ApiResponse().SetOk("Updated");
    }

    public async Task<ApiResponse> NewUpdateMedicalRecord(int userId, int id, NewMedicalRecordUpdateModel newMedicalRecord)
    {
        var existMed = await _unitOfWork.MedicalRecordRepo.GetMrById(id);

        if (existMed is not null)
        {
            var user = await _unitOfWork.UserRepo.GetAsync(u => u.UserId == userId);
            if (user == null) return new ApiResponse().SetNotFound("User Not Found");
            if (user.CategoryId != DefaultMrOption.DefaultCategoryId) return new ApiResponse().SetNotFound("User Is Not Allowed To Update Mr, Only Doctors With Default Category ID are allowed");

            // add medical record service and doctor
            if (newMedicalRecord.ServiceDetails is not null)
            {
                //add services
                var currentDefaultServicesSelected = existMed.ServiceMedicalRecords?.ToList();
                existMed.ServiceMedicalRecords?.Clear();

                existMed.ServiceMedicalRecords = newMedicalRecord.ServiceDetails.Select(
                    s => new ServiceMedicalRecord()
                    {
                        ServiceId = s.ServiceId,
                        DoctorId = s.DoctorId,
                    }).ToList();
                //add default 
                if (currentDefaultServicesSelected is not null)
                {
                    foreach (var service in currentDefaultServicesSelected)
                    {
                        //neu srv mr moi co chu srv cu thi update status va ispaid
                        if (existMed.ServiceMedicalRecords.Any(x => x.ServiceId == service.ServiceId))
                        {
                            var s = existMed.ServiceMedicalRecords.Where(x => x.ServiceId == service.ServiceId).FirstOrDefault();
                            if (s is not null)
                            {
                                s.Status = service.Status;
                                s.IsPaid = service.IsPaid;
                                s.Description = service.Description;
                                s.Diagnose = service.Diagnose;
                            }
                        }
                        else
                        {
                            var defaultCate = await _unitOfWork.CategoryRepo.GetCategoryByServiceId(service.ServiceId);
                            defaultCate ??= new Category()
                            {
                                CategoryId = 0
                            };
                            if (service.IsPaid
                                || service.Status is not null
                                || service.Status == true
                                || defaultCate.CategoryId == DefaultMrOption.DefaultCategoryId)
                            {
                                existMed.ServiceMedicalRecords.Add(new ServiceMedicalRecord()
                                {
                                    ServiceId = service.ServiceId,
                                    DoctorId = service.DoctorId,
                                    Status = service.Status,
                                    IsPaid = service.IsPaid,
                                    Description = service.Description,
                                    Diagnose = service.Diagnose,
                                });
                            }
                        }
                    }
                }

                //Add doctors
                existMed.MedicalRecordDoctors?.Clear();
                var docIs = new List<int>();
                foreach (var detail in existMed.ServiceMedicalRecords)
                {
                    if (!docIs.Any(x => x == detail.DoctorId))
                    {
                        docIs.Add(detail.DoctorId);
                        existMed.MedicalRecordDoctors?.Add(new()
                        {
                            DoctorId = detail.DoctorId,
                            MedicalRecordId = existMed.MedicalRecordId
                        });
                    }
                }

                if (newMedicalRecord.CategoryIds is not null)
                {
                    //add cates
                    var cateIds = new List<int>();

                    foreach (var service in existMed.ServiceMedicalRecords)
                    {
                        var cate = await _unitOfWork.CategoryRepo.GetCategoryByServiceId(service.ServiceId);
                        if (cate is not null)
                        {
                            if (cateIds.All(x => x != cate.CategoryId))
                            {
                                cateIds.Add(cate.CategoryId);
                            }
                        }
                    }

                    foreach (var cateId in cateIds)
                    {
                        if (existMed.MedicalRecordCategories is not null
                            && !existMed.MedicalRecordCategories.Any(x => x.CategoryId == cateId))
                        {
                            existMed.MedicalRecordCategories ??= new List<MedicalRecordCategory>();
                            existMed.MedicalRecordCategories.Add(new MedicalRecordCategory()
                            {
                                CategoryId = cateId
                            });
                        }
                    }
                }
            }

            await _unitOfWork.SaveChangeAsync();

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

            return new ApiResponse().SetOk("Updated");
        }
        return new ApiResponse().SetBadRequest("Not Found");
    }

    public async Task<ApiResponse> GetReCheckUpMedicalRecordByPreviosMedicalRecordId(int prevMrId)
    {
        var response = new ApiResponse();
        var prevMr = await _unitOfWork.MedicalRecordRepo.GetAsync(x => x.PreviousMedicalRecordId == prevMrId);
        if (prevMr is null)
        {
            return new ApiResponse().SetNotFound("Not Found");
        }
        response.SetOk(prevMr.MedicalRecordId);
        return response;
    }

    public async Task<List<MedicalRecord>> GetListMedicalRecordsByRole(int userId, List<MedicalRecord> medicalRecords)
    {
        var user = await _unitOfWork.UserRepo.GetAsync(u => u.UserId == userId);
        if (user == null) return medicalRecords;
        if (user.RoleId != (int)UserRole.Doctor) return medicalRecords;

        var filteredListMr = new List<MedicalRecord>();

        foreach (var mr in medicalRecords)
        {
            var mrDetail = await _unitOfWork.MedicalRecordRepo.GetMrById(mr.MedicalRecordId);

            if (mrDetail != null && mrDetail.MedicalRecordDoctors != null)
            {
                foreach (var mrDoctor in mrDetail.MedicalRecordDoctors)
                {
                    if (mrDoctor.DoctorId == user.UserId)
                    {
                        filteredListMr.Add(mr);
                    }
                }
            }
        }
        return filteredListMr;
    }

    public async Task<ApiResponse> GetPrescriptonDiagnoseByMrId(int mrId)
    {
        var mr = await _unitOfWork.MedicalRecordRepo.GetPrescriptionDiagnoseByMrId(mrId);
        if (mr is null) return new ApiResponse().SetNotFound("Mr not found");
        PresciptionStatusPaidModel result = new()
        {
            Diagnose = mr?.ExaminationResult?.Prescription?.Diagnose ?? string.Empty,
            IsPaid = mr?.ExaminationResult?.Prescription?.IsPaid ?? false
        };
        return new ApiResponse().SetOk(result);
    }

    public async Task<ApiResponse> GetListNextMrIdsByMrId(int mrId)
    {
        var response = await _unitOfWork.MedicalRecordRepo.GetListNextMrIds(mrId);
        if (response is not null)
        {
            return new ApiResponse().SetOk(response);
        }
        return new ApiResponse().SetBadRequest("Id not found");
    }

    public async Task<ApiResponse> PayPrescriptionByMrId(int mrId)
    {
        var response = await _unitOfWork.PrescriptionRepo.PayPrescription(mrId);
        if (response == true)
        {
            await _unitOfWork.SaveChangeAsync();
            return new ApiResponse().SetOk("Paid Prescription");
        };
        return new ApiResponse().SetBadRequest("Paid failed");
    }
}

public class PresciptionStatusPaidModel
{
    public string Diagnose { get; set; } = string.Empty;
    public bool IsPaid { get; set; } = false;
}