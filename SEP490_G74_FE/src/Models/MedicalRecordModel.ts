export interface Doctor {
  id: number;
  name: string;
  categoryId: number;
  roleId: number;
}

export interface Category {
  categoryId: number;
  name: string;
}

export interface ServiceType {
  id: number;
  name: string;
  services: Service[];
}

export interface Service {
  id: number;
  name: string;
  serviceTypeId: number;
}

export interface MedicalRecord extends PatientTableModel {
  patientId: number;
  height: number;
  weight: number;
  blood: string;
  bloodPressure: number;
  editDate: string;
  description: string;
  examReason: string;
  isPaid: boolean;
  isCheckUp: boolean;
  selectedCategoryIds: number[];
  selectedServiceTypeIds: number[];
  selectedServiceIds: number[];
  selectedDoctorIds: number[];
  selectedReCheckUpServiceTypeIds?: number[];
  selectedReCheckUpServiceIds?: number[];
  selectedDoctorId?: number;
}

export interface MedicalRecordTableModel {
  medicalRecordId: number;
  medicalRecordDate: string;
  name: string;
  patientId: number;
  isPaid: boolean;
  isCheckUp: boolean;
  key: string;
  priority: number;
  isCheckUpCompleted: string;
  index: number;
  isHaveUnpaidPrescription :boolean
}

export interface PatientTableModel {
  id: number;
  name: string;
  dob: string;
  gender: boolean;
  phone: string;
  address: string;
  key: string;
}

export interface PatientProps {
  patientId: number;
  role?: string;
  medicalRecordId?: number;
  isReload?: boolean;
}

export interface MedicalRecordAddModel {
  examReason: string;
  categoryIds: number[];
  patientId: number;
  doctorIds: number[];
  previousMedicalRecordId?: number;
}

// Get medical record detail by id
export interface MedicalRecordDetailModel {
  medicalRecordId: number;
  medicalRecordDate: string;
  examReason: string;
  examCode: string;
  isPaid: boolean;
  isCheckUp: boolean;
  categories: CategoryDetailModel[];
  patientId: number;
  doctors: DoctorDetailModel[];
  serviceTypes: ServiceTypeDetailModel[];
  prevMedicalRecordId: number;
}
export interface ServiceTypeDetailModel {
  serviceTypeId: number;
  serviceTypeName: string;
  services: ServiceDetailModel[];
  isDeleted: boolean;
}
export interface ServiceDetailModel {
  serviceId: number;
  serviceName: string;
  serviceTypeId: number;
  price: number;
  isDeleted: boolean;
}

export interface CategoryDetailModel {
  categoryId: number;
  categoryName: string;
  isDeleted: boolean;
}

export interface DoctorDetailModel {
  doctorId: number;
  doctorName: string;
  categoryId: number;
  isDeleted: boolean;
}

export interface MedicalRecordUpdateModel {
  categoryIds: number[];
  doctorIds: number[];
  serviceIds: number[];
  serviceDetails: ServiceDetails[];
}

export interface ServiceDetails {
  doctorId: number;
  serviceId: number;
}

export interface ExaminationProps {
  medicalRecordId: number;
  isReload: boolean;
  patientId?: number;
  isPaid?: boolean;
}

export interface PatientMedicalRecordExaminationPrintModel {
  id: number;
  patientId: number;
  name: string;
  dob: string;
  gender: boolean;
  phone: string;
  address: string;
  height: number;
  weight: number;
  blood: string;
  bloodPressure: number;
  editDate: string;
  description: string;
  isPaid: boolean;
  isCheckUp: boolean;
  categoryName: string;
  doctorName: string;
  serviceId: number;
  serviceName: string;
  diagnose: string;
  conclusion: string;
  status: boolean;
  price: number;
  image: string;
}

export interface ServicePrintModel {
  serviceId: number;
  serviceName: string;
  diagnose: string;
  conclusion: string;
  status: boolean;
  price: number;
  image: string;
}
