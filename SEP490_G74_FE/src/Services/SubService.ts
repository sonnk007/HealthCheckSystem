import { JWTTokenModel, UserLogin } from "../Models/AuthModel";
import apiLinks from "../Commons/ApiEndpoints";
import httpClient from "../HttpClients/HttpClient";
import {
  PatientAddModel,
  PatientTableResponseModel,
} from "../Models/PatientModel";
import { TOKEN } from "../Commons/Global";
import { jwtDecode } from "jwt-decode";
import {
  DoctorResponseModel,
  SelectedSuppliesResponseModel,
  ServiceAddModel,
  ServiceResponseModel,
  ServiceTypeAddModel,
  ServiceTypeResponseModel,
  ServiceTypeUpdateModel,
  ServiceUpdateModel,
  SuppliesPresAddModel,
  SupplyAddModel,
  SupplyIdPreAddModel,
  SupplyResponseModel,
  SupplyTypeAddModel,
  SupplyTypeResponseModel,
} from "../Models/SubEntityModel";

const getDoctorsByCategoryId = async (
  id: number
): Promise<DoctorResponseModel[] | undefined> => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        if (id <= 0) return undefined;
        var url = `${apiLinks.doctor.getDoctorByCategoryId}${id}`;
        const response = await httpClient.get({
          url: url,
          authorization: `Bearer ${token}`,
        });

        return response.data.result as DoctorResponseModel[];
      }
    }
    return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

const getLeastAssignedDoctorByCategoryId = async (
  id: number
): Promise<DoctorResponseModel | undefined> => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        if (id <= 0) return undefined;
        var url = `${apiLinks.doctor.getLeastAssignedDoctorByCategoryId}${id}`;
        const response = await httpClient.get({
          url: url,
          authorization: `Bearer ${token}`,
        });

        return response.data.result as DoctorResponseModel;
      }
    }
    return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

const getServicesType = async (
  id: number
): Promise<ServiceTypeResponseModel[] | undefined> => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);
      if (uToken !== null) {
        var url = `${apiLinks.serviceType.getServicesType}${id}`;
        const response = await httpClient.get({
          url: url,
          authorization: `Bearer ${token}`,
        });
        return response.data.result as ServiceTypeResponseModel[];
      }
    }
    return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

const getServices = async (
  id: number
): Promise<ServiceResponseModel[] | undefined> => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);
      if (uToken !== null) {
        var url = `${apiLinks.service.getServices}${id}`;
        const response = await httpClient.get({
          url: url,
          authorization: `Bearer ${token}`,
        });
        return response.data.result as ServiceResponseModel[];
      }
    }
    return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

const getAllSupplyTypes = async (
): Promise<SupplyTypeResponseModel[] | undefined> => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        var url = `${apiLinks.supply.getAllSupplyTypes}`;
        const response = await httpClient.get({
          url: url,
          authorization: `Bearer ${token}`,
        });

        return response.data.result.items as SupplyTypeResponseModel[];
      }
    }
    return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

const getSuppliesBySupplyTypeId = async (
  id: number
): Promise<SupplyResponseModel[] | undefined> => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        if (id <= 0) return undefined;
        var url = `${apiLinks.supply.getSuppliesBySupplyTypeId}${id}`;
        const response = await httpClient.get({
          url: url,
          authorization: `Bearer ${token}`,
        });
        return response.data.result.supplies as SupplyResponseModel[];
      }
    }
    return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

const getAllSupplies = async (
): Promise<SupplyResponseModel[] | undefined> => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        var url = `${apiLinks.supply.getAllSupplies}`;
        const response = await httpClient.get({
          url: url,
          authorization: `Bearer ${token}`,
        });
        return response.data.result as SupplyResponseModel[];
      }
    }
    return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

const addSuppliesPrescriptionsByMrId = async (
  id: number,
  params: SuppliesPresAddModel
) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.post({
          url: `${apiLinks.supply.postSuppliesPrescriptionByMrId}${id}`,
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

const getSelectedSuppliesByMrId = async (
  id: number
): Promise<SelectedSuppliesResponseModel[] | undefined> => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        if (id <= 0) return undefined;
        var url = `${apiLinks.supply.getSelectedSuppliesByMrId}${id}`;
        const response = await httpClient.get({
          url: url,
          authorization: `Bearer ${token}`,
        });
        return response.data.result as SelectedSuppliesResponseModel[];
      }
    }
    return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

const updateServiceType = async (
  id: number,
  params: ServiceTypeUpdateModel
) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.put({
          url: `${apiLinks.serviceType.getServicesType}${id}`,
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

const addServiceType = async (
  id: number,
  params: ServiceTypeAddModel
) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        params.categoryId = id;
        const response = await httpClient.post({
          url: `${apiLinks.serviceType.postServicesType}`,
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

const addService = async (
  id: number,
  params: ServiceAddModel
) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        params.serviceTypeId = id;
        const response = await httpClient.post({
          url: `${apiLinks.service.postServices}`,
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

const updateService = async (
  id: number,
  params: ServiceUpdateModel
) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.put({
          url: `${apiLinks.service.getServices}${id}`,
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

const addSupplyType = async (
  params: SupplyTypeAddModel
) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.post({
          url: `${apiLinks.supply.getAllSupplyTypes}`,
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

const updateSupplyType = async (
  id: number,
  params: SupplyTypeAddModel
) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.put({
          url: `${apiLinks.supply.putUpdateSupplyType}${id}`,
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

const addSupply = async (
  params: SupplyAddModel
) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.post({
          url: `${apiLinks.supply.postAddSupply}`,
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

const updateSupply = async (
  id: number,
  params: SupplyAddModel
) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.put({
          url: `${apiLinks.supply.putUpdateSupply}${id}`,
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

//=========delete
const deleteServiceType = async (
  id: number,
) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.delete({
          url: `${apiLinks.serviceType.deleteServicesType}${id}`,
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

const deleteService = async (
  id: number,
) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.delete({
          url: `${apiLinks.service.deleteServices}${id}`,
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

const deleteSupplyType = async (
  id: number,
) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.delete({
          url: `${apiLinks.supply.deleteSupplyType}${id}`,
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

const deleteSupply = async (
  id: number,
) => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token !== null) {
      var uToken: JWTTokenModel = jwtDecode(token);

      if (uToken !== null) {
        const response = await httpClient.delete({
          url: `${apiLinks.supply.deleteSupply}${id}`,
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

const subService = {
  getDoctorsByCategoryId: getDoctorsByCategoryId,
  getServicesType: getServicesType,
  getServices: getServices,
  getLeastAssignedDoctorByCategoryId: getLeastAssignedDoctorByCategoryId,
  getAllSupplyTypes: getAllSupplyTypes,
  getSuppliesBySupplyTypeId: getSuppliesBySupplyTypeId,
  addSuppliesPrescriptionsByMrId: addSuppliesPrescriptionsByMrId,
  getSelectedSuppliesByMrId: getSelectedSuppliesByMrId,
  updateServiceType: updateServiceType,
  addServiceType: addServiceType,
  addService: addService,
  updateService: updateService,
  getAllSupplies: getAllSupplies,
  addSupplyType: addSupplyType,
  updateSupplyType: updateSupplyType,
  addSupply: addSupply,
  updateSupply: updateSupply,
  deleteServiceType: deleteServiceType,
  deleteService: deleteService,
  deleteSupplyType: deleteSupplyType,
  deleteSupply: deleteSupply,
};

export default subService;
