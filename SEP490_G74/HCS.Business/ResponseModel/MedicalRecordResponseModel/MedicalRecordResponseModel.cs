namespace HCS.Business.ResponseModel.MedicalRecordResponseModel;

public class MedicalRecordResponseModel
{
    public int MedicalRecordId { get; set; }

    public DateTime MedicalRecordDate { get; set; } = DateTime.Now;

    public string ExamReason { get; set; } = string.Empty;

    public string ExamCode { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public byte? Height { get; set; }

    public byte? Weight { get; set; }

    public string? BloodGroup { get; set; }

    public byte? BloodPressure { get; set; }

    public string? Allergieshistory { get; set; }
}