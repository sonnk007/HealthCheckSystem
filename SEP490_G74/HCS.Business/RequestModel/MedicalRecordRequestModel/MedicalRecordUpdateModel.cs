namespace HCS.Business.RequestModel.MedicalRecordRequestModel;

public class MedicalRecordUpdateModel
{
    public DateTime MedicalRecordDate { get; set; } = DateTime.Now;

    public string ExamReason { get; set; } = string.Empty;

    public string ExamCode { get; set; } = string.Empty;

    public int CategoryId { get; set; }

    public int PatientId { get; set; }

    public int DoctorId { get; set; }
    public int PrescriptionId { get; set; }
}

public class NewMedicalRecordUpdateModel
{
    public List<int>? CategoryIds { get; set; }

    public List<int>? DoctorIds { get; set; }

    public List<int>? ServiceTypeIds { get; set; }

    public List<int>? ServiceIds { get; set; }

    public List<NewServiceMrDoctorUpdateModel> ServiceDetails { get; set; } = new();
}

public class NewServiceMrDoctorUpdateModel
{
    public int ServiceId { get; set; }
    public int DoctorId { get; set; }
}