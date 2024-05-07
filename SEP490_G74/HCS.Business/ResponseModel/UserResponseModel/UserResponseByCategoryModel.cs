namespace HCS.Business.ResponseModel.UserResponseModel;

public class UserResponseByCategoryModel
{
    public string CategoryName { get; set; } = string.Empty;
    public string RoleName { get; set; } = string.Empty;
    public int? CategoryId { get; set; }
    public int? UserId { get; set; }
    public int? RoleId { get; set; }
    public string? UserName { get; set; }
    public bool IsDeleted { get; set; } = false;

}