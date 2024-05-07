using HCS.Domain.Commons;

namespace HCS.Business.RequestModel.PatientContactRequestModel;

public class PatientContactRequestModel
{
    public string Name { get; set; } = null!;

    public bool Gender { get; set; }

    public string Phone { get; set; } = string.Empty;

    public DateTime Dob { get; set; }

    public string Address { get; set; } = string.Empty;

    public string Img { get; set; } = string.Empty;

    public string ServiceDetailName { get; set; } = null!;

    public byte? Height { get; set; }

    public byte? Weight { get; set; }

    public string? BloodGroup { get; set; } = DefaultText.NOT_AVAILABLE;

    public byte? BloodPressure { get; set; }

    public string? AllergiesHistory { get; set; } = DefaultText.NOT_AVAILABLE;

    //public int? PatientId { get; set; }

    public int? UserId { get; set; }
}