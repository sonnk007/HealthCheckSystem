export interface CategoryAddModel {
  categoryName: string;
}

export interface ServiceTypeAddModel {
  serviceTypeName: string;
  categoryId: number;
}

export interface ServiceAddModel {
  serviceName: string;
  serviceTypeId: number;
  price?: number;
}

export interface BaseModel {
  id: number;
  name: string;
  parentId?: number;
}

export interface CategoryResponseModel {
  categoryId: number;
  categoryName: string;
  isDeleted: boolean;
}

export interface ServiceTypeResponseModel {
    serviceTypeId: number;
    serviceTypeName: string;
    categoryId?: number;
    categoryName?: string;
    isDeleted?: boolean;
}

export interface ServiceResponseModel {
    serviceId: number;
    serviceName: string;
    price: number;
    serviceTypeId?: number;
    serviceTypeName?: string;
    isDeleted: boolean;
    doctorId?: number;
    doctorName?: string;
}

export interface DoctorResponseModel {
    userId: number,
    userName: string,
    isDeleted: boolean,
    categoryId: number,
}

export interface ExaminationsResultModel {
  medicalRecordId: number;
  examDetails: ExamDetail[];
  diagnosis?: string;
  conclusion?: string;
}
export interface ExamDetail {
  medicalRecordId: number;
  serviceId: number;
  serviceName: string;
  description: string;
  diagnose: string;
  price?: number;
  status?: boolean;
  image? : string;
  isPaid: boolean;
}

export interface ExamResultAddModel{
  medicalRecordId: number;
  diagnosis: string;
  conclusion: string;
}

export interface ExamResultGetModel{
  examResultId: number,
  diagnosis: string,
  conclusion: string,
  examDate?: string
}

export interface SupplyTypeResponseModel {
  suppliesTypeId: number
  suppliesTypeName: string
  isDeleted: boolean
  supplies: SupplyResponseModel[]
}

export interface SupplyResponseModel {
  sId: number
  sName: string
  uses: string
  exp: string
  distributor: string
  unitInStock: number
  price: number
  inputday: string
  isDeleted:boolean
  suppliesTypeId: number
  suppliesTypeName?: string
  dose?: string
}

export interface SuppliesPresAddModel {
  medicalRecordId: number
  diagnose: string
  supplyIds: SupplyIdPreAddModel[]
}

export interface SupplyIdPreAddModel {
  supplyId: number
  quantity: number
  dose: string
}

export interface SupplyPresSelectFormModel {
  medicalRecordId: number
  selectedSupplies: SupplyIdSelectFormModel[]
  selectedSupplyTypes: SupplyTypeIdSelectFormModel[]
}

export interface SupplyIdSelectFormModel {
  supplyId: number
  quantity: number
  dose: string
}

export interface SupplyTypeIdSelectFormModel {
  supplyId: number
  quantity: number
}

export interface SelectedSuppliesResponseModel {
  supplyId: number
  supplyName: string
  quantity: number
  price: number
  uses: string
  dose: string
}

export interface ServiceTypeUpdateModel{
  serviceTypeName: string
}

export interface ServiceUpdateModel{
  serviceName: string
}

export interface SupplyTypeAddModel{
  suppliesTypeName: string
}

export interface SupplyAddModel {
  sName: string
  uses: string
  exp: string
  distributor: string
  unitInStock: number
  price: number
  suppliesTypeId: number
}

export interface DoctorCategoryByServiceModel{
  categoryName: string
  doctorName: string
}

export interface PrescriptionDiagnosIsPaidModel{
  diagnose: string
  isPaid:boolean
}