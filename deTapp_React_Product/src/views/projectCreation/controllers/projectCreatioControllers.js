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

/**
 * Fetches the list of cmds from the API.
 *
 * @async
 * @function getprojectCreationController
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the API request fails.
 * @example
 * getprojectCreationController()
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const getProjectController = async () => {
  try {
    // Send the GET request to the projectCreation API endpoint
    const response = await get("estimate/project_details", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProjectTypesController = async () => {
  try {
    // Send the GET request to the projectCreation API endpoint
    const response = await get("estimate/project_type", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getClientInfoController = async () => {
  try {
    // Send the GET request to the projectCreation API endpoint
    const response = await get("estimate/client_info", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const projectCreationController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }
    const email = decodeData(getCookie(isUserIdCookieName));
    // Prepare the body object with sanitized data
    const body = {
      PROJECT_NAME: titleCaseFirstWord(formData?.projectName),
      CLIENT_ID: formData.client.CLIENT_CODE_ID,
      PROJECT_TYPE_ID: formData?.projectType.PROJECT_TYPE_ID,
      CREATED_BY: email,
      IS_ACTIVE: true,
    };
    // Send the POST request to the projectCreation API endpoint
    const response = await post("estimate/project_details", body, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing projectCreation with the given form data.
 *
 * @async
 * @function cmdupdateController
 * @param {Object} formData - The form data for updating the projectCreation.
 * @param {string} formData.cmdId - The projectCreation ID.
 * @param {string} formData.ID - The primary key for projectCreation ID.*
 * @param {string} formData.firstName - The first name.
 * @param {string} formData.lastName - The last name.
 * @param {string} formData.email - The email address.
 * @param {string} formData.mobileNo - The mobile number.
 * @param {Object|string} formData.role - The role object or role ID.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   cmdId: "123",
 *   firstName: "John",
 *   lastName: "Doe",
 *   email: "john.doe@example.com",
 *   mobileNo: "1234567890",
 *   role: { ID: "admin", NAME: "Admin" }
 * };
 * cmdupdateController(formData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */

export const projectUpdateController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }
    // Prepare the body object with sanitized data
    const email = decodeData(getCookie(isUserIdCookieName));

    const body = {
      PROJECT_NAME: titleCaseFirstWord(formData?.projectName),
      CLIENT_ID: formData.client.CLIENT_CODE_ID,
      PROJECT_TYPE_ID: formData?.projectType.PROJECT_TYPE_ID,
      UPDATED_BY: email,
      IS_ACTIVE: true,
    };
    // Send the PUT request to the projectCreation API endpoint
    const response = await put(
      `estimate/project_details/${formData.ID}`,
      body,
      "python"
    );
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a projectCreation with the given ID.
 *
 * @async
 * @function cmddeleteController
 * @param {number} cmdId - The ID of the projectCreation to delete.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the projectCreation ID is invalid or the API request fails.
 * @example
 * cmddeleteController(123)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const projectDeleteController = async (cmdId) => {
  try {
    // Data Validation and Sanitization
    if (typeof cmdId !== "number") {
      throw new Error("Invalid form data");
    }
    // Send the DELETE request to the projectCreation API endpoint
    const response = await remove(
      `estimate/project_details/${cmdId}`,
      "python"
    );
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
