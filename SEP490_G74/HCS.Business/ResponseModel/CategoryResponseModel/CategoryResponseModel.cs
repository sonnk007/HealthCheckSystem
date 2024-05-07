namespace HCS.Business.ResponseModel.CategoryResponse;

public class CategoryResponseModel
{
    public int CategoryId { get; set; }
    
    public string CategoryName { get; set; } = string.Empty;

    public bool IsDeleted { get; set; } = false;
}