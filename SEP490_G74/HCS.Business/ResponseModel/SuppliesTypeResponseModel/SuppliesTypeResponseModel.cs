using HCS.Domain.Models;

namespace HCS.Business.ResponseModel.SuppliesTypeResponseModel;

public class SuppliesTypeResponseModel
{
    public int SuppliesTypeId { get; set; }

    public string SuppliesTypeName { get; set; } = string.Empty;

    public bool IsDeleted { get; set; } = false;

}

public class SuppliesByTypeModel
{
    public int SuppliesTypeId { get; set; }

    public string SuppliesTypeName { get; set; } = string.Empty;

    public List<SupplyResponseModel> Supplies { get; set; } = new List<SupplyResponseModel>();
}

public class SupplyResponseModel
{
    public int SId { get; set; }

    public string SName { get; set; } = string.Empty;

    public string Uses { get; set; } = string.Empty;

    public DateTime Exp { get; set; } = DateTime.Now;

    public string Distributor { get; set; } = string.Empty;

    public short UnitInStock { get; set; }

    public double Price { get; set; }

    public DateTime Inputday { get; set; } = DateTime.Now;

    public int SuppliesTypeId { get; set; }

    public bool IsDeleted { get; set; } = false;
}

public class SupplyPrescriptionsAddModel
{
    public int MedicalRecordId { get; set; }
    public string Diagnose { get; set; } = string.Empty;
    public List<SupplyPrescriptionAddModel> SupplyIds { get; set; } = new List<SupplyPrescriptionAddModel>();
}

public class SupplyPrescriptionAddModel
{
    public int SupplyId { get; set; }
    public int Quantity { get; set; }
    public string Dose { get; set; } = string.Empty;
}

public class SupplyPrescriptionResponseModel
{
    public int SupplyId { get; set; }
    public string SupplyName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public double Price { get; set; }
    public string Uses { get; set; } = string.Empty;
    public string Dose { get; set; } = string.Empty;
}