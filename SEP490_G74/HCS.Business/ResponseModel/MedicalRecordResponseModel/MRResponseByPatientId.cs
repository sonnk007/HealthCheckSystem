using HCS.Business.ResponseModel.CategoryResponse;
using HCS.Domain.Models;

namespace HCS.Business.ResponseModel.MedicalRecordResponseModel;

public class MrResponseByPatientId
{
    public int MedicalRecordId { get; set; }
    public DateTime MedicalRecordDate { get; set; } = DateTime.Now;
    public string Name { get; set; } = string.Empty;
    public int PatientId { get; set; }

    public bool IsPaid { get; set; } = false;
    public bool IsCheckUp { get; set; } = false;
    public int Priority { get; set; }
    public int Index { get; set; }
    public string IsCheckUpCompleted { get; set; } = string.Empty;
}

public class MedicalRecordDetailResponseModel
{
    public int MedicalRecordId { get; set; }

    public DateTime MedicalRecordDate { get; set; } = DateTime.Now;

    public string ExamReason { get; set; } = string.Empty;

    public string ExamCode { get; set; } = string.Empty;

    public List<CategoryResponseModel> Categories { get; set; } = new();

    public int PatientId { get; set; }

    public List<DoctorResponseModel> Doctors { get; set; } = new List<DoctorResponseModel>();

    public bool IsPaid { get; set; } = false;

    public bool IsCheckUp { get; set; } = false;

    public List<ServiceTypeDetailResponseModel> ServiceTypes { get; set; } = new List<ServiceTypeDetailResponseModel>();

    public int? PrevMedicalRecordId { get; set; }
}

public class ServiceTypeDetailResponseModel
{
    public int ServiceTypeId { get; set; }
    public string ServiceTypeName { get; set; } = string.Empty;
    public bool IsDeleted { get; set; } = false;
    public List<ServiceResponseDetailModel> Services { get; set; } = new List<ServiceResponseDetailModel>();
}

public class ServiceResponseDetailModel
{
    public int ServiceId { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public int ServiceTypeId { get; set; }
    public double Price { get; set; }
    public bool IsDeleted { get; set; } = false;
    public int DoctorId { get; set; }
    public string DoctorName { get; set; } = string.Empty;
}

public class DoctorResponseModel
{
    public int DoctorId { get; set; }
    public string DoctorName { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public bool IsDeleted { get; set; } = false;
}