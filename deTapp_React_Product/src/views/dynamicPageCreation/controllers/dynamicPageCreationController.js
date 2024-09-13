import { get, post } from "../../utilities/apiservices/apiServices";
import { getCookie } from "../../utilities/cookieServices/cookieServices";
import { isUserIdCookieName } from "../../utilities/generals";
import { decodeData } from "../../utilities/securities/encodeDecode";

export const getTableListDataController = async () => {
  try {
    const email = decodeData(getCookie(isUserIdCookieName));
    // Send the GET request to the projectCreation API endpoint
    const response = await get("AllTables", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getColumnsDetailsController = async (tableName) => {
  try {
    // Send the GET request to the projectCreation API endpoint
    const response = await get(`columnDetails/${tableName}`, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const generatePythonAPIController = async (tableName) => {
  try {
    // Send the GET request to the projectCreation API endpoint
    const body = {
      table: tableName,
      override: 0,
    };
    const response = await post(`generate_blueprint`, body, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getInputFieldController = async () => {
  try {
    // Send the GET request to the projectCreation API endpoint
    const response = await get(`inputField`, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const createReactFormController = async (formData) => {
  try {
    const email = decodeData(getCookie(isUserIdCookieName));

    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    console.log({ formData });
    debugger;
    // Send the GET request to the projectCreation API endpoint
    const response = await get("AllTables", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
