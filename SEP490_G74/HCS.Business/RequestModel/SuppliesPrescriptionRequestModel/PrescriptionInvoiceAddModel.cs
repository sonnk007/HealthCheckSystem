using HCS.Domain.Models;

namespace HCS.Business.RequestModel.SuppliesPrescriptionRequestModel;

public class PrescriptionInvoiceAddModel
{
    public int MedicalRecordId { get; set; }
    public ICollection<PrescriptionTemp> PrescriptionTemps { get; set; } = null!;

}

public class PrescriptionTemp
{
    public int SupplyId { get; set; }
    public int Quantity { get; set; }
}