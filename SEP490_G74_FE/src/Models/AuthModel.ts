export interface LoginResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string;
  result: string;
}

export interface LoginFieldsType {
  email?: string;
  password?: string;
  remember?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface JWTTokenModel {
  role: string;
  unique_name: string;
  nameid?: string;
}

export interface AccountResponseModel {
  userId: number;
  userName: string;
  email: string;
  roleId: number;
  roleName: string;
  isDeleted: boolean;
  name: string;
  gender: boolean;
  phone: string;
  dob: string;
  address: string;
  categoryId: number;
}

export interface AddAccountModel {
  password: string;
  confirmPassword: string;
  email: string;
  status: boolean;
  roleId: number;
  categoryId: number;
  roles?: RoleResponseModel[];
  name: string;
  gender: boolean;
  phone: string;
  dob: string;
  address: string;
}

export interface UpdateAccountModel {
  userId: number;
  password: string;
  confirmPassword: string;
  roleId: number;
  categoryId: number;
  name: string;
  gender: boolean;
  phone: string;
  dob: string;
  address: string;
}

export interface RoleResponseModel {
  roleId: number;
  roleName: string;
}
