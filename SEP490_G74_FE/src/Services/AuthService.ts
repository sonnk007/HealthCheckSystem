import { AccountResponseModel, AddAccountModel, RoleResponseModel, UpdateAccountModel, UserLogin } from "../Models/AuthModel";
import apiLinks from "../Commons/ApiEndpoints";
import httpClient from "../HttpClients/HttpClient";

const login = async (params: UserLogin): Promise<string|undefined> => {
  try{
    const response = await httpClient.post({
      url: `${apiLinks.auth.postLogin}`,
      data: params,
    });
    return response.data.result as string;
  }catch(e){
    console.log(e)
    return undefined
  }
};

const getAccounts = async () => {
  try{
    const response = await httpClient.get({
      url: `${apiLinks.auth.getAccounts}`,
    });
    return response.data.result as AccountResponseModel[];
  }catch(e){
    console.log(e)
    return undefined
  }
};

const register = async (data: AddAccountModel) => {
  try{
    const response = await httpClient.post({
      url: `${apiLinks.auth.postRegister}`,
      data: JSON.stringify(data),
    });
    return response.status as number;
  }catch(e){
    console.log(e)
    return undefined
  }
};
const getRoles = async () => {
  try{
    const response = await httpClient.get({
      url: `${apiLinks.auth.getRoles}`,
    });
    return response.data.result as RoleResponseModel[];
  }catch(e){
    console.log(e)
    return undefined
  }
};

const updateAccount = async (account: UpdateAccountModel) => {
  try{
    const response = await httpClient.put({
      url: `${apiLinks.auth.putAccount}`,
      data: JSON.stringify(account),
    });
    return response.status as number;
  }catch(e){
    console.log(e)
    return undefined
  }
};

const deleteAccount = async (id:number) => {
  try{
    const response = await httpClient.delete({
      url: `${apiLinks.auth.deleteAccount}${id}`,
    });
    return response.status as number;
  }catch(e){
    console.log(e)
    return undefined
  }
};

const authService = {
  login: login,
  getAccounts: getAccounts,
  register: register,
  getRoles: getRoles,
  updateAccount: updateAccount,
  deleteAccount: deleteAccount,
};

export default authService;
