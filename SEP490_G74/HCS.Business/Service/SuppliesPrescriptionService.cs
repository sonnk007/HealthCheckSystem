using HCS.Business.RequestModel.SuppliesPrescriptionRequestModel;
using HCS.Business.ResponseModel.ApiResponse;
using HCS.Business.ResponseModel.SupplyPrescriptionResponseModel;
using HCS.DataAccess.UnitOfWork;
using HCS.Domain.Models;

namespace HCS.Business.Service;

public interface ISuppliesPrescriptionService
{
    Task<ApiResponse> AddPrescriptionInvoice(PrescriptionInvoiceAddModel prescriptionInvoiceAddModel);
    Task<ApiResponse> GetPrescriptionInvoice(int medicalRecordId);
}

public class SuppliesPrescriptionService : ISuppliesPrescriptionService
{
    private readonly IUnitOfWork _unitOfWork;

    public SuppliesPrescriptionService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse> AddPrescriptionInvoice(PrescriptionInvoiceAddModel prescriptionInvoiceAddModel)
    {
        var response = new ApiResponse();

        var medicalRecordEntity =
            await _unitOfWork.MedicalRecordRepo.GetMrForPrescriptionByMedicalRecordId(prescriptionInvoiceAddModel
                .MedicalRecordId);
        if (medicalRecordEntity is null) return response.SetNotFound("Medical record not found");
        if (medicalRecordEntity.ExaminationResult is not null)
        {
            if (medicalRecordEntity.ExaminationResult.Prescription is not null)
            {
                if (medicalRecordEntity.ExaminationResult.Prescription.SuppliesPrescriptions == null)
                {
                    medicalRecordEntity.ExaminationResult.Prescription.SuppliesPrescriptions =
                        prescriptionInvoiceAddModel.PrescriptionTemps.Select(
                            x => new SuppliesPrescription()
                            {
                                Quantity = x.Quantity,
                                SupplyId = x.SupplyId
                            }).ToList();
                }
                else
                {
                    foreach (var item in prescriptionInvoiceAddModel.PrescriptionTemps)
                    {
                        var isSuppliesPrescriptionExisted =
                            medicalRecordEntity.ExaminationResult.Prescription.SuppliesPrescriptions.Any(x =>
                                x.SupplyId == item.SupplyId);
                        if (isSuppliesPrescriptionExisted)
                        {
                            var existedSuppliesPrescription =
                                medicalRecordEntity.ExaminationResult.Prescription.SuppliesPrescriptions.First(x =>
                                    x.SupplyId == item.SupplyId);
                            if (item.Quantity > existedSuppliesPrescription.Supply.UnitInStock) continue;
                            existedSuppliesPrescription.Quantity += item.Quantity;
                            existedSuppliesPrescription.Supply.UnitInStock -= (short)item.Quantity;
                        }
                        else
                        {
                            var existedSuppliesPrescription =
                                medicalRecordEntity.ExaminationResult.Prescription.SuppliesPrescriptions.First(x =>
                                    x.SupplyId == item.SupplyId);

                            var temp = new SuppliesPrescription();
                            if (item.Quantity > existedSuppliesPrescription.Supply.UnitInStock) continue;
                            temp.Quantity = item.Quantity;
                            temp.SupplyId = item.SupplyId;
                            existedSuppliesPrescription.Supply.UnitInStock -= (short)item.Quantity;
                        }
                    }
                }
            }
            else
            {
                medicalRecordEntity.ExaminationResult.Prescription = new Prescription()
                {
                    Diagnose = string.Empty,
                    SuppliesPrescriptions = prescriptionInvoiceAddModel.PrescriptionTemps.Select(
                        x => new SuppliesPrescription()
                        {
                            Quantity = x.Quantity,
                            SupplyId = x.SupplyId
                        }).ToList()
                };
            }
        }

        await _unitOfWork.SaveChangeAsync();

        return response.SetOk("Created");
    }

    public async Task<ApiResponse> GetPrescriptionInvoice(int medicalRecordId)
    {
        var response = new ApiResponse();

        var existedMedicalRecord =
            await _unitOfWork.MedicalRecordRepo.GetMrForPrescriptionByMedicalRecordId(medicalRecordId);

        if (existedMedicalRecord is null)
        {
            return response.SetNotFound("MedicalRecord Not Found");
        }

        if (existedMedicalRecord.ExaminationResult?.Prescription?.SuppliesPrescriptions is null)
        {
            return response.SetNotFound("Not Found");
        }

        var temp = existedMedicalRecord.ExaminationResult.Prescription.SuppliesPrescriptions.Select(
            x => new SupplyTemp()
            {
                SupplyId = x.SupplyId,
                SupplyName = x.Supply.SName,
                Uses = x.Supply.Uses,
                Exp = x.Supply.Exp,
                Distributor = x.Supply.Distributor,
                Price = x.Supply.Price,
                SuppliesTypeId = x.Supply.SuppliesTypeId,
                SupplyTypeName = x.Supply.SuppliesType.SuppliesTypeName,
                Quantity = x.Quantity
            }).ToList();

        var itemResponse =
            new SupplyPrescriptionResponseModel()
            {
                PrescriptionId = existedMedicalRecord.ExaminationResult.Prescription.PrescriptionId,
                SupplyTemps = temp
            };

        return response.SetOk(itemResponse);
    }
}