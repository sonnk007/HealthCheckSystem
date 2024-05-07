import { JWTTokenModel } from "../Models/AuthModel";
import apiLinks from "../Commons/ApiEndpoints";
import httpClient from "../HttpClients/HttpClient";
import {
  ApiResponseModel,
  PatientAddModel,
  PatientTableResponseModel,
} from "../Models/PatientModel";
import { TOKEN } from "../Commons/Global";
import { jwtDecode } from "jwt-decode";

const getPatients = async (
  pageIndex: number,
  pageSize:number
): Promise<ApiResponseModel | undefined> => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        if (pageIndex <= 0) pageIndex = 1;
        var url = `${
          apiLinks.patients.getPatients
        }?pageIndex=${pageIndex}&pageSize=${pageSize}&userId=${uToken.nameid}`;

        const response = await httpClient.get({
          url: url,
          authorization: `Bearer ${token}`,
        });

        var apiResponse : ApiResponseModel = response.data.result as ApiResponseModel
        console.log(apiResponse)
        //return response.data.result.items as PatientTableResponseModel[];
        return apiResponse;
      }
    }
    return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

const getPatientById = async (
  id: number
): Promise<PatientAddModel | undefined> => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        if (id <= 0) return undefined
        var url = `${
          apiLinks.patients.gtPatientById}${id}`;
        const response = await httpClient.get({
          url: url,
          
          authorization: `Bearer ${token}`,
        });

        return response.data.result as PatientAddModel;
      }
    }
    return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

const addPatientContact = async (patientContact: PatientAddModel) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.post({
          url: `${apiLinks.patients.postPatient}`,
          authorization: `Bearer ${token}`,
          data: JSON.stringify(patientContact),
        });

        return response.status as number;
      }
    }
    return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

const patientService = {
  getPatients: getPatients,
  getPatientById: getPatientById,
  addPatientContact: addPatientContact,
};

export default patientService;
