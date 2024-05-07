namespace HCS.Business.RequestModel.ServiceTypeRequestModel;

public class ServiceTypeUpdateModel
{
    public string ServiceTypeName { get; set; } = string.Empty;
    //public int CategoryId { get; set; }
}

public class ServiceUpdateModel
{
    public string ServiceName { get; set; } = string.Empty;
    public double Price { get; set; } = 1000;
    //public int CategoryId { get; set; }
}