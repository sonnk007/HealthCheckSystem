namespace HCS.Business.RequestModel.ExaminationResultRequestModel;

public class ExaminationResultAddModel
{
    public int MedicalRecordId { get; set; }
    public string Diagnosis { get; set; } = string.Empty;

    public string Conclusion { get; set; } = string.Empty;
}