namespace HCS.Business.RequestModel.PatientRequestModel;

public class PatientUpdateModel
{
    public string ServiceDetailName { get; set; } = null!;

    public byte? Height { get; set; }

    public byte? Weight { get; set; }

    public string? BloodGroup { get; set; }

    public byte? BloodPressure { get; set; }

    public string? Allergieshistory { get; set; }
}