export interface PatientAddModel{
    name: string,
    gender: string,
    phone: string,
    address: string,
    dob: string,
    img: string,
    height: number,
    weight: number
    bloodGroup:string
    bloodPressure: string
    allergieshistory: string
    serviceDetailName?:string
    patientId?: number
    key?: string
}

export interface PatientTableResponseModel {
    patientId: number;
    name: string;
    gender: boolean;
    phone: string;
    dob: string;
    address: string;
    key: string;
  }

export interface ApiResponseModel{
    totalCount: number,
    items: any[]
}