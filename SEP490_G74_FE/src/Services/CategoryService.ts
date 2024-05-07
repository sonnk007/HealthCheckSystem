import { JWTTokenModel } from "../Models/AuthModel";
import apiLinks from "../Commons/ApiEndpoints";
import httpClient from "../HttpClients/HttpClient";
import { TOKEN } from "../Commons/Global";
import { jwtDecode } from "jwt-decode";
import {
  CategoryAddModel,
  CategoryResponseModel,
  DoctorCategoryByServiceModel,
} from "../Models/SubEntityModel";

const addCategory = async (params: CategoryAddModel) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.post({
          url: apiLinks.category.postCategory,
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

const updateCategory = async (id: number, params: CategoryAddModel) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.put({
          url: `${apiLinks.category.putCategory}${id}`,
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

const getCategories = async () => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.get({
          url: apiLinks.category.getCategories,
          authorization: `Bearer ${token}`,
        });

        return response.data.result as CategoryResponseModel[];
      }
    }
    return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

const deleteCategories = async (id: number) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.delete({
          url: apiLinks.category.deleteCategory + id,
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

const getDoctorCategoryByService = async (serviceId: number, mrId: number) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.get({
          url: apiLinks.category.getDoctorCategory + serviceId + "/" + mrId,
          authorization: `Bearer ${token}`,
        });

        return response.data.result as DoctorCategoryByServiceModel;
      }
    }
    return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

const postIsDefaultDoctor = async () => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);
      if (uToken !== null) {
        const response = await httpClient.post({
          url: `${apiLinks.category.postIsDefaultDoctor}`,
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

const categoryService = {
  addCategory: addCategory,
  getCategories: getCategories,
  updateCategory: updateCategory,
  deleteCategories: deleteCategories,
  getDoctorCategoryByService: getDoctorCategoryByService,
  postIsDefaultDoctor: postIsDefaultDoctor,
};

export default categoryService;
