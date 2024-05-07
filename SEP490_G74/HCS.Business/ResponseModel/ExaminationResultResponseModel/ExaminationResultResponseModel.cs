namespace HCS.Business.ResponseModel.ExaminationResultResponseModel;

public class ExaminationResultResponseModel
{
    public int ExamResultId { get; set; }

    public string Diagnosis { get; set; } = string.Empty;

    public string Conclusion { get; set; } = string.Empty;

    public DateTime ExamDate { get; set; } = DateTime.Now;
    public int? PrescriptionId { get; set; }
}