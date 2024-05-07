const vsPort = "7021"
const vsCodePort = "5160"
const baseUrls = `https://localhost:${vsPort}/api/`
//const baseUrls = `http://localhost:${vsCodePort}/api/`

const apiLinks = {
    auth: {
        postLogin: `${baseUrls}Users/login`,
        getAccounts: `${baseUrls}Users`,
        postRegister: `${baseUrls}Users/register`,
        getRoles: `${baseUrls}Users/roles`,
        putAccount: `${baseUrls}Users/update`,
        deleteAccount: `${baseUrls}Users/`,
    },
    patients:{
        getPatients:`${baseUrls}Users/patients`,
        gtPatientById:`${baseUrls}Patient/`,
        postPatient:`${baseUrls}Users/patient-contact`
    },
    medicalRecords:{
        getMedicalRecords:`${baseUrls}MedicalRecords`,
        // getMedicalRecordsByPatientId:`${baseUrls}MedicalRecords/id/:patientId?pageIndex=1&pageSize=5`,
        getMedicalRecordsByPatientId:`${baseUrls}MedicalRecords/id/`,
        getMedicalRecordsUnCheckByPatientId:`${baseUrls}MedicalRecords/id/un-check/`,
        getMedicalRecordsUnPaidByPatientId:`${baseUrls}MedicalRecords/id/un-paid/`,
        postMedicalRecord:`${baseUrls}MedicalRecords`,
        getMedicalRecordById:`${baseUrls}MedicalRecords/detail/id/`,
        patchMrStatusPaid:`${baseUrls}MedicalRecords/payment/id/`,
        patchMrStatusCheckUp:`${baseUrls}MedicalRecords/check-up/id/`,
        pathUpdateMr:`${baseUrls}MedicalRecords/id/`,
        getReCheckUpMrByPrevMrId:`${baseUrls}MedicalRecords/recheck-up/id/`,
        getPreDiagnoseByMrId:`${baseUrls}MedicalRecords/prescription-diagnose/id/`,
        getNextMrIdsByMrId:`${baseUrls}MedicalRecords/next-mrs/id/`,
        postPayPrescriptionByMrId: `${baseUrls}MedicalRecords/pay-prescription/id/`,
    },
    category:{
        getCategories:`${baseUrls}Category`,
        postCategory:`${baseUrls}Category`,
        putCategory:`${baseUrls}Category/`,
        deleteCategory:`${baseUrls}Category/`,
        getDoctorCategory: `${baseUrls}Category/doctor-category/`,
        postIsDefaultDoctor: `${baseUrls}Category/is-default-doctor`,
    },
    serviceType:{
        getServicesType:`${baseUrls}ServiceType/`,
        postServicesType:`${baseUrls}ServiceType`,
        deleteServicesType:`${baseUrls}ServiceType/`,
    },
    service:{
        getServices:`${baseUrls}ServiceType/service/`,
        postServices:`${baseUrls}ServiceType/service`,
        deleteServices:`${baseUrls}ServiceType/service/`,
    }
    ,
    doctor:{
        getDoctorByCategoryId:`${baseUrls}Users/doctor/id/`,
        getLeastAssignedDoctorByCategoryId: `${baseUrls}Users/doctor/least-assigned/id/`
    },
    examination:{
        postAddExamResult:`${baseUrls}ExaminationResult`,
        getListServicesByCategoryId:`${baseUrls}ExaminationResult/detail/id/`,
        putUpdateExaminationResult:`${baseUrls}ExaminationResult/detail/id/`,
        getExamResultByMedicalRecordId:`${baseUrls}ExaminationResult/id/`,
        patchPayServiceMr:`${baseUrls}ExaminationResult/detail/pay/mrId/`,
    },
    supply:{
        getAllSupplyTypes:`${baseUrls}SuppliesType`,
        getSuppliesBySupplyTypeId:`${baseUrls}SuppliesType/supplies/`,
        postSuppliesPrescriptionByMrId:`${baseUrls}SuppliesType/supplies-prescription/`,
        getSelectedSuppliesByMrId:`${baseUrls}SuppliesType/selected-supplies/`,
        getAllSupplies: `${baseUrls}Supply`,
        putUpdateSupplyType:`${baseUrls}SuppliesType/`,
        deleteSupplyType:`${baseUrls}SuppliesType/`,
        postAddSupply:`${baseUrls}Supply`,
        putUpdateSupply:`${baseUrls}Supply/`,
        deleteSupply:`${baseUrls}Supply/`,
    }
}

export default apiLinks