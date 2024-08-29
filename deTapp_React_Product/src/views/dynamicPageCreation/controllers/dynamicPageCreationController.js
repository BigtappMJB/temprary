import {
  get,
  post,
  remove,
  put,
} from "../../utilities/apiservices/apiServices";
import { getCookie } from "../../utilities/cookieServices/cookieServices";
import {
  isUserIdCookieName,
  titleCaseFirstWord,
} from "../../utilities/generals";
import { decodeData } from "../../utilities/securities/encodeDecode";

export const getTableListDataController = async () => {
  try {
    const email = decodeData(getCookie(isUserIdCookieName));
    // Send the GET request to the projectCreation API endpoint
    const response = await get("master/AllTables", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getColumnsDetailsController = async (tableName) => {
  try {
    // Send the GET request to the projectCreation API endpoint
    const response = await get(`master/columnDetails/${tableName}`, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getInputFieldController = async (tableName) => {
  try {
    // Send the GET request to the projectCreation API endpoint
    const response = await get(`master/inputField`, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const createReactFormController = async () => {
  try {
    const email = decodeData(getCookie(isUserIdCookieName));
    // Send the GET request to the projectCreation API endpoint
    const response = await get("master/AllTables", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
