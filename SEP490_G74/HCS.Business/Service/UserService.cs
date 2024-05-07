using AutoMapper;
using HCS.DataAccess.UnitOfWork;
using HCS.Domain.Models;
using HCS.Business.RequestModel.UserRequestModel;
using HCS.Business.ResponseModel.ApiResponse;
using HCS.Business.ResponseModel.PatientResponseModel;
using HCS.Business.Util.JWT;
using HCS.Business.Util.MD5PasswordGenerator;
using HCS.Business.Pagination;
using HCS.Business.RequestModel.ContactRequestModel;
using HCS.Business.RequestModel.PatientContactRequestModel;
using HCS.Business.RequestModel.PatientRequestModel;
using HCS.Business.ResponseModel.UserResponseModel;
using static HCS.Business.Util.MD5PasswordGenerator.PasswordGenerator;
using HCS.Domain;
using Microsoft.Identity.Client;
using HCS.Domain.Enums;


namespace HCS.Business.Service
{
    public interface IUserService
    {
        public Task<ApiResponse> Login(UserLoginRequestModel user);
        public Task<ApiResponse> GetProfile(int userId);

        Task<ApiResponse> RegisterUser(UserRegisterModel registerUser);

        Task<ApiResponse> GetPatients(int pageIndex, int pageSize, int userId);

        Task<ApiResponse> AddPatientContact(PatientContactRequestModel patientContactRequestModel);

        Task<ApiResponse> GetListDoctorByCategoryId(int categoryId);

        Task<ApiResponse> GetLeastAssginedDoctorByCategoryId(int categoryId);

        Task<ApiResponse> GetAllAccounts();

        Task<ApiResponse> GetAllRoles();

        Task<ApiResponse> UpdateAccount(AccountUpdateModel account);

        Task<ApiResponse> RemoveAccount(int userId);
    }

    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public UserService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse> Login(UserLoginRequestModel user)
        {
            var pwd = PasswordGenerator.GetMD5Hash(user.Password);
            var account = await _unitOfWork.UserRepo
                .GetAsync(u => u.Email.Equals(user.Email) && u.Password.Equals(pwd));

            var loginResponse = new ApiResponse();
            if (account != null)
            {
                var jwtUser = await _unitOfWork.UserRepo.GetProfile(account.Email);

                if (jwtUser != null)
                {
                    var token = JwtTokenHelper.CreateToken(jwtUser);
                    loginResponse.SetOk(token);
                }
            }
            else
            {
                loginResponse.SetNotFound(message: $"Email Not Found: {user.Email}");
            }

            return loginResponse;
        }

        public async Task<ApiResponse> GetProfile(int userId)
        {
            ApiResponse res = new();
            var account = await _unitOfWork.UserRepo.GetAsync(u => u.UserId == userId);

            if (account == null)
            {
                res.SetNotFound("User Not Found With ID: " + userId);
                return res;
            }

            var profile = await _unitOfWork.UserRepo.GetProfile(account.Email);

            if (profile == null)
            {
                res.SetNotFound("User Profile Not Found With Email: " + account.Email);
                return res;
            }

            res.SetOk(profile);
            return res;
        }

        public async Task<ApiResponse> RegisterUser(UserRegisterModel registerUser)
        {
            var response = new ApiResponse();

            var isMatchPassword = IsMatchPassword(user: registerUser);

            if (isMatchPassword is false)
            {
                return response.SetBadRequest(message: "Confirm Password does not matched");
            }

            var newUser = new User()
            {
                Password = GetMD5Hash(registerUser.Password),
                Email = registerUser.Email,
                Status = true,
                RoleId = registerUser.RoleId,
                CategoryId = registerUser.CategoryId < 1 ? null : registerUser.CategoryId,
                Contact = new Contact()
                {
                    Address = registerUser.Address,
                    Dob = registerUser.Dob,
                    Gender = registerUser.Gender,
                    Img = string.Empty,
                    Name = registerUser.Name,
                    Phone = registerUser.Phone,
                }
            };

            var profile = await _unitOfWork.UserRepo.GetProfile(registerUser.Email);
            if (profile is not null) return new ApiResponse().SetBadRequest("Email existed");

            await _unitOfWork.UserRepo.AddAsync(newUser);
            await _unitOfWork.SaveChangeAsync();
            return response.SetOk("Created");
        }

        public async Task<ApiResponse> UpdateAccount(AccountUpdateModel account)
        {
            var response = new ApiResponse();

            var isMatchPassword = IsMatchPassword(user: new UserRegisterModel()
            {
                Password = account.Password,
                ConfirmPassword = account.ConfirmPassword
            });

            if (isMatchPassword is false)
            {
                return response.SetBadRequest(message: "Confirm Password does not matched");
            }

            //var user = await _unitOfWork.UserRepo.GetAsync(x => x.UserId == account.UserId);
            var user = await _unitOfWork.UserRepo.GetUserWithContact(account.UserId);
            if (user == null) return response.SetNotFound();
            user.Password = GetMD5Hash(account.Password);
            user.RoleId = account.RoleId;
            user.CategoryId = account.RoleId == (int)UserRole.Doctor ? account.CategoryId : null;
            if(user.Contact is not null)
            {
                user.Contact.Address = account.Address;
                user.Contact.Name = account.Name;
                user.Contact.Phone = account.Phone;
                user.Contact.Dob = account.Dob;
            }
            await _unitOfWork.SaveChangeAsync();
            return response.SetOk("Updated");
        }

        public async Task<ApiResponse> RemoveAccount(int userId)
        {
            var response = new ApiResponse();

            var user = await _unitOfWork.UserRepo.GetAsync(x => x.UserId == userId);
            if(user != null)
            {
                user.IsDeleted = !user.IsDeleted;
                await _unitOfWork.SaveChangeAsync();
                return response.SetOk("deleted");
            }
            return response.SetNotFound("Not found");
        }

        private static bool IsMatchPassword(UserRegisterModel user)
        {
            return user.Password is not null && user.Password.Equals(user.ConfirmPassword);
        }

        public async Task<ApiResponse> GetPatients(int pageIndex, int pageSize, int userId)
        {
            ApiResponse res = new();

            var patients = await _unitOfWork.PatientRepo.GetPatients(userId);

            var listOfPatients = _mapper.Map<List<PatientResponseModel>>(patients);

            listOfPatients = listOfPatients.OrderByDescending(p => p.PatientId).ToList();

            var patientsResponse = listOfPatients.Paginate(pageIndex, pageSize);

            return res.SetOk(patientsResponse);
        }

        public async Task<ApiResponse> AddPatientContact(PatientContactRequestModel patientContactRequestModel)
        {
            var response = new ApiResponse();

            var patientRequest = new Patient()
            {
                ServiceDetailName = patientContactRequestModel.ServiceDetailName,
                Height = patientContactRequestModel.Height,
                Weight = patientContactRequestModel.Weight,
                BloodGroup = patientContactRequestModel.BloodGroup,
                BloodPressure = patientContactRequestModel.BloodPressure,
                Allergieshistory = patientContactRequestModel.AllergiesHistory,
                Contact = new Contact()
                {
                    Address = patientContactRequestModel.Address,
                    Gender = patientContactRequestModel.Gender,
                    Name = patientContactRequestModel.Name,
                    Img = patientContactRequestModel.Img,
                    Phone = patientContactRequestModel.Phone,
                    Dob = patientContactRequestModel.Dob,
                }
            };

            await _unitOfWork.PatientRepo.AddAsync(patientRequest);
            await _unitOfWork.SaveChangeAsync();

            return response.SetOk("Created");
        }

        public async Task<ApiResponse> GetListDoctorByCategoryId(int categoryId)
        {
            var response = new ApiResponse();

            var listExistUsers = await _unitOfWork.UserRepo.GetAllAsync(x => x.CategoryId == categoryId);

            var listDoctorResponse = new List<UserResponseByCategoryModel>();
            foreach (var item in listExistUsers)
            {
                var existRole = await _unitOfWork.RoleRepo.GetAsync(x => x.RoleId == item.RoleId);
                var roleName = string.Empty;

                if (existRole.RoleName != "Doctor") continue;
                {
                    roleName = existRole.RoleName;

                    var existCategory = await _unitOfWork.CategoryRepo.GetAsync(x => x.CategoryId == item.CategoryId);

                    var result = new UserResponseByCategoryModel()
                    {
                        CategoryName = existCategory.CategoryName,
                        RoleName = roleName,
                        CategoryId = item.CategoryId,
                        RoleId = item.RoleId,
                        UserId = item.UserId,
                        IsDeleted = item.IsDeleted
                    };

                    var profile = await _unitOfWork.UserRepo.GetProfile(item.Email);

                    if (profile is not null)
                    {
                        result.UserName = profile.UserName;
                    }
                    else
                    {
                        result.UserName = "Nguyễn Văn Sơn";
                    }


                    listDoctorResponse.Add(result);
                }
            }

            return response.SetOk(listDoctorResponse);
        }

        public async Task<ApiResponse> GetLeastAssginedDoctorByCategoryId(int categoryId)
        {
            var response = new ApiResponse();

            var listExistUsers = await _unitOfWork.UserRepo.GetAllDoctorByCategoryIdAsync(categoryId);

            foreach (var u in listExistUsers)
            {
                u.MedicalRecordDoctors ??= new List<MedicalRecordDoctor>();
            }

            var leastAssignedDoctor = listExistUsers.OrderBy(d => d.MedicalRecordDoctors?.Count).FirstOrDefault();

            if (leastAssignedDoctor is null) return response.SetBadRequest();
            else
            {
                var result = new UserResponseByCategoryModel()
                {
                    CategoryName = leastAssignedDoctor.Category is not null ? leastAssignedDoctor.Category.CategoryName : string.Empty,
                    RoleName = leastAssignedDoctor.Role.RoleName,
                    CategoryId = leastAssignedDoctor.CategoryId,
                    RoleId = leastAssignedDoctor.RoleId,
                    UserId = leastAssignedDoctor.UserId,
                    UserName = leastAssignedDoctor.Contact is not null ? leastAssignedDoctor.Contact.Name : string.Empty,
                    IsDeleted = leastAssignedDoctor.IsDeleted
                };
                return response.SetOk(result);
            }
        }

        public async Task<ApiResponse> GetAllAccounts()
        {
            //var accounts = await _unitOfWork.UserRepo.GetAllAsync(x => x.Status == true);
            var accounts = await _unitOfWork.UserRepo.GetAllAsync(null);

            if (accounts is null)
            {
                accounts = new List<User>();
            }

            List<UserJWTModel> result = new();

            foreach (var account in accounts)
            {
                var item = await _unitOfWork.UserRepo.GetProfile(account.Email);
                if (item != null)
                {
                    result.Add(item);
                }
            }
            return new ApiResponse().SetOk(result);
        }

        public async Task<ApiResponse> GetAllRoles()
        {
            var roles = await _unitOfWork.RoleRepo.GetAllAsync(x => true);
            roles = roles.Select(x => new Role()
            {
                RoleId = x.RoleId,
                RoleName = x.RoleName,
                Users = null,
            }).ToList();
            return new ApiResponse().SetOk(roles);
        }
    }
}