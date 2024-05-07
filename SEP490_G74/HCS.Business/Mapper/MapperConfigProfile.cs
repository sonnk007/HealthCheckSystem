using AutoMapper;
using HCS.Domain.Models;
using HCS.Business.RequestModel.CategoryRequestModel;
using HCS.Business.RequestModel.ContactRequestModel;
using HCS.Business.RequestModel.ExaminationResultRequestModel;
using HCS.Business.RequestModel.MedicalRecordRequestModel;
using HCS.Business.RequestModel.PatientRequestModel;
using HCS.Business.RequestModel.PrescriptionRequestModel;
using HCS.Business.RequestModel.ServiceTypeRequestModel;
using HCS.Business.RequestModel.SuppliesRequestModel;
using HCS.Business.RequestModel.SuppliesTypeRequestModel;
using HCS.Business.RequestModel.UserRequestModel;
using HCS.Business.ResponseModel.CategoryResponse;
using HCS.Business.ResponseModel.ExaminationResultResponseModel;
using HCS.Business.ResponseModel.MedicalRecordResponseModel;
using HCS.Business.ResponseModel.PatientResponseModel;
using HCS.Business.ResponseModel.PrescriptionResponseModel;
using HCS.Business.ResponseModel.ServiceTypeResponseModel;
using HCS.Business.ResponseModel.SuppliesResponseModel;
using HCS.Business.ResponseModel.SuppliesTypeResponseModel;
using HCS.Business.ResponseModel.UserResponseModel;

namespace HCS.Business.Mapper
{
    public class MapperConfigProfile : Profile
    {
        public MapperConfigProfile()
        {
            
            CreateMap<UserRegisterModel, User>().ReverseMap();
            CreateMap<UserUpdateModel, User>().ReverseMap();
            CreateMap<UserLoginRequestModel, User>().ReverseMap();
            
            
            CreateMap<MedicalRecordAddModel, MedicalRecord>();
            
            CreateMap<ContactAddModel, Contact>();

            CreateMap<CategoryAddModel, Category>().ReverseMap();
            CreateMap<CategoryUpdateModel, Category>().ReverseMap();
            CreateMap<CategoryResponseModel, Category>().ReverseMap();

            //CreateMap<Patient, PatientResponseModel>()
            //    .ForMember(dest => dest.PatientId, opt => opt.MapFrom(src => src.Contacts.First().PatientId))
            //    .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Contacts.First().Name))
            //    .ForMember(dest => dest.Dob, opt => opt.MapFrom(src => src.Contacts.First().Dob))
            //    .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Contacts.First().Gender))
            //    .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Contacts.First().Address))
            //    .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Contacts.First().Phone))
            //    .ReverseMap();

            CreateMap<Patient, PatientResponseModel>()
                .ForMember(dest => dest.PatientId, opt => opt.MapFrom(src => src.PatientId))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Contact != null ? src.Contact.Name : string.Empty))
                .ForMember(dest => dest.Dob, opt => opt.MapFrom(src => src.Contact != null ? src.Contact.Dob : DateTime.Now ))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Contact != null ? src.Contact.Gender : true))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Contact != null ? src.Contact.Address : string.Empty))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Contact != null ? src.Contact.Phone : string.Empty))
                .ReverseMap();

            CreateMap<PatientAddModel, Patient>().ReverseMap();
            CreateMap<PatientUpdateModel, Patient>().ReverseMap();

            CreateMap<SuppliesTypeAddModel, SuppliesType>().ReverseMap();
            CreateMap<SuppliesTypeUpdateModel, SuppliesType>().ReverseMap();
            CreateMap<SuppliesTypeResponseModel, SuppliesType>().ReverseMap();

            CreateMap<PrescriptionAddModel, Prescription>().ReverseMap();
            CreateMap<PrescriptionUpdateModel, Prescription>().ReverseMap();
            CreateMap<PrescriptionResponseModel, Prescription>().ReverseMap();

            CreateMap<ServiceTypeAddModel, ServiceType>().ReverseMap();
            CreateMap<ServiceTypeUpdateModel, ServiceType>().ReverseMap();
            CreateMap<ServiceType, ServiceTypeResponseModel>().ReverseMap();
            CreateMap<HCS.Domain.Models.Service, ServiceResponseModel>().ReverseMap();

            CreateMap<ExaminationResultAddModel, ExaminationResult>().ReverseMap();
            CreateMap<ExaminationUpdateModel, ExaminationResult>().ReverseMap();
            CreateMap<ExaminationResultResponseModel, ExaminationResult>().ReverseMap();

            CreateMap<SuppliesAddModel, Supply>().ReverseMap();
            CreateMap<SuppliesUpdateModel, Supply>().ReverseMap();
            CreateMap<SuppliesResponseModel, Supply>().ReverseMap();
        }
    }
}
