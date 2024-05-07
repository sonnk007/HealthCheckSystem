namespace HCS.Business.RequestModel.UserRequestModel;

public class UserUpdateModel
{
    public string Password { get; set; } = null!;

    public string Email { get; set; } = null!;

    public bool? Status { get; set; }

    public int RoleId { get; set; }

    public int? CategoryId { get; set; } = null;
}