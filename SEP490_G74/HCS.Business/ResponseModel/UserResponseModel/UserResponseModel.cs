namespace HCS.Business.ResponseModel.UserResponseModel;

public class UserResponseModel
{
    public int UserId { get; set; }
    
    public string Email { get; set; } = null!;

    public bool? Status { get; set; }

    public int RoleId { get; set; }
    
    public int? CategoryId { get; set; } = null;

}