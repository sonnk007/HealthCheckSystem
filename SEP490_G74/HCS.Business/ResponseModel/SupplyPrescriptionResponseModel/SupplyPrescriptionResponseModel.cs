namespace HCS.Business.ResponseModel.SupplyPrescriptionResponseModel;

public class SupplyPrescriptionResponseModel
{
    public int PrescriptionId { get; set; }
    public ICollection<SupplyTemp> SupplyTemps { get; set; } = null!;
}

public class SupplyTemp
{
    public int SupplyId { get; set; }
    public string SupplyName { get; set; } = string.Empty;
    public string Uses { get; set; } = string.Empty;
    public DateTime Exp { get; set; }
    public string Distributor { get; set; } = string.Empty;
    public double Price { get; set; }
    public int SuppliesTypeId { get; set; }
    public string SupplyTypeName { get; set; } = string.Empty;
    public int Quantity { get; set; }
}