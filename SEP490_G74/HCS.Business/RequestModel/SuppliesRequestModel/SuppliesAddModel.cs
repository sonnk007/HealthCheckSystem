namespace HCS.Business.RequestModel.SuppliesRequestModel;

public class SuppliesAddModel
{
    public string SName { get; set; } = null!;

    public string Uses { get; set; } = null!;

    public DateTime Exp { get; set; }

    public string Distributor { get; set; } = null!;

    public short UnitInStock { get; set; }

    public double Price { get; set; }
    
    public int SuppliesTypeId { get; set; }
}