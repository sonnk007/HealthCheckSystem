namespace HCS.Business.ResponseModel.SuppliesResponseModel;

public class SuppliesResponseModel
{
    public int SId { get; set; }

    public string SName { get; set; } = null!;

    public string Uses { get; set; } = null!;

    public DateTime Exp { get; set; }

    public string Distributor { get; set; } = null!;

    public short UnitInStock { get; set; }

    public double Price { get; set; }

    public DateTime Inputday { get; set; } = DateTime.Now;

    public int SuppliesTypeId { get; set; }

    public bool IsDeleted { get; set; } = false;
}