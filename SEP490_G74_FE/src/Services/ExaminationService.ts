import { jwtDecode } from "jwt-decode";
import apiLinks from "../Commons/ApiEndpoints";
import { TOKEN } from "../Commons/Global";
import httpClient from "../HttpClients/HttpClient";
import { JWTTokenModel } from "../Models/AuthModel";
import {
  ExamResultAddModel,
  ExamResultGetModel,
  ExaminationsResultModel,
} from "../Models/SubEntityModel";

const getListExamServicesByMrId = async (
  id: number
): Promise<ExaminationsResultModel | undefined> => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);
      if (uToken !== null) {
        var url = `${apiLinks.examination.getListServicesByCategoryId}${id}`;
        const response = await httpClient.get({
          url: url,
          authorization: `Bearer ${token}`,
        });
        return response.data.result as ExaminationsResultModel;
      }
    }
    return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

const getExamResultByMrId = async (
  id: number
): Promise<ExamResultGetModel | undefined> => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);
      if (uToken !== null) {
        var url = `${apiLinks.examination.getExamResultByMedicalRecordId}${id}`;
        const response = await httpClient.get({
          url: url,
          authorization: `Bearer ${token}`,
        });
        if (response.status !== 200) {
          var newExamResult: ExamResultGetModel = {
            examResultId: id,
            diagnosis: "",
            conclusion: "",
          };
          return newExamResult;
        }
        return response.data.result as ExamResultGetModel;
      }
    }
    return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

const putUpdateExaminationResult = async (
  id: number,
  params: ExaminationsResultModel
) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.put({
          url: `${apiLinks.examination.putUpdateExaminationResult}${id}`,
          authorization: `Bearer ${token}`,
          data: JSON.stringify(params),
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

const postAddExaminationResult = async (
  id: number,
  params: ExamResultAddModel
) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.post({
          url: `${apiLinks.examination.postAddExamResult}`,
          authorization: `Bearer ${token}`,
          data: JSON.stringify(params),
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

const patchPayServiceMr = async (
  mrId: number,
  serviceId: number
) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.patch({
          url: `${apiLinks.examination.patchPayServiceMr}${mrId}/serviceId/${serviceId}`,
          authorization: `Bearer ${token}`,
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

const ExaminationService = {
  getListExamServicesByMrId: getListExamServicesByMrId,
  putUpdateExaminationResult: putUpdateExaminationResult,
  postAddExaminationResult: postAddExaminationResult,
  getExamResultByMrId: getExamResultByMrId,
  patchPayServiceMr: patchPayServiceMr,
};

export default ExaminationService;
