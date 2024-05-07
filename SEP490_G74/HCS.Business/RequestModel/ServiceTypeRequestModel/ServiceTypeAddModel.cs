namespace HCS.Business.RequestModel.ServiceTypeRequestModel;

public class ServiceTypeAddModel
{
    public string ServiceTypeName { get; set; } = string.Empty;
    public int CategoryId { get; set; }
}

public class ServiceAddModel
{
    public string ServiceName { get; set; } = string.Empty;
    public int ServiceTypeId { get; set; }
    public double Price { get; set; } = 1000;
}