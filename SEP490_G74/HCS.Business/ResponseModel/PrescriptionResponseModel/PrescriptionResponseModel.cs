namespace HCS.Business.ResponseModel.PrescriptionResponseModel;

public class PrescriptionResponseModel
{
    public int PrescriptionId { get; set; }

    public DateTime CreateDate { get; set; } = DateTime.Now;

    public string Diagnose { get; set; } = string.Empty;
}