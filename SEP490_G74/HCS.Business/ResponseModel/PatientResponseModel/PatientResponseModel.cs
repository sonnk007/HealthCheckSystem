using HCS.Domain.Models;

namespace HCS.Business.ResponseModel.PatientResponseModel;

public class PatientResponseModel
{
    public int PatientId { get; set; }

    public string Name { get; set; } = null!;

    public bool Gender { get; set; }

    public string Phone { get; set; } = string.Empty;

    public DateTime Dob { get; set; }

    public string Address { get; set; } = string.Empty;

    public string ServiceDetailName { get; set; } = null!;

    public byte? Height { get; set; }

    public byte? Weight { get; set; }

    public string? BloodGroup { get; set; }

    public byte? BloodPressure { get; set; }

    public string? Allergieshistory { get; set; }
}