import {
  get,
  post,
  remove,
  put,
} from "../../utilities/apiservices/apiServices";
import { getCookie } from "../../utilities/cookieServices/cookieServices";
import { isUserIdCookieName, titleCaseFirstWord } from "../../utilities/generals";
import { decodeData } from "../../utilities/securities/encodeDecode";


export const getProjectRoleControllers = async () => {
  try {
    // Send the GET request to the cmd API endpoint
    const response = await get("estimate/project_roles", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProjectPhaseControllers = async () => {
  try {
    // Send the GET request to the cmd API endpoint
    const response = await get("estimate/project_phases", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches the list of cmds from the API.
 *
 * @async
 * @function getCMDController
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the API request fails.
 * @example
 * getCMDController()
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const getProjectEstimationControllers = async () => {
  try {
    // Send the GET request to the cmd API endpoint
    const response = await get("cmd/Allcmd", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};


export const getClientControllers = async () => {
  try {
    // Send the GET request to the cmd API endpoint
    const response = await get("cmd/Allcmd", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};


/**
   * Creates a new cmd with the given form data.
   *
   * @async
   * @function cmdCreationController
   * @param {Object} formData - The form data for the new cmd.
   * @param {string} formData.firstName - The first name.
   * @param {string} formData.lastName - The last name.
   * @param {string} formData.email - The email address.
   * @param {string} formData.mobileNo - The mobile number.
   * @param {Object|string} formData.role - The role object or role ID.
   * @returns {Promise<Object>} - The response data from the API.
   * @throws {Error} - If the form data is invalid or the API request fails.
   * @example
   * const formData = {
  
   *   firstName: "John",
   *   lastName: "Doe",
   *   email: "john.doe@example.com",
   *   mobileNo: "1234567890",
   *   role: { ID: "admin", NAME: "Admin" }
   * };
   * cmdCreationController(formData)
   *   .then(response => console.log(response))
   *   .catch(error => console.error(error));
   */

export const projectEstimateCreationController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }
    const email = decodeData(getCookie(isUserIdCookieName));

    // Prepare the body object with sanitized data
    const body = {
      Phase_ID: formData?.phase.PHASE_ID,
      Role_ID: formData?.role.Role_ID,
      Activity_Code_ID: formData?.projectName.ACTIVITY_CODE_ID,
      Start_Date: formData.startDate.format("YYYY-MM-DD"),
      End_Date: formData.endDate.format("YYYY-MM-DD"),
      No_of_Hours_Per_Day: formData.hoursPerDay,
      Total_Hours: 16,
      created_by: email,
      is_active: true,
    };
    // Send the POST request to the cmd API endpoint
    const response = await post("cmd/addCMD", body, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing cmd with the given form data.
 *
 * @async
 * @function cmdupdateController
 * @param {Object} formData - The form data for updating the cmd.
 * @param {string} formData.cmdId - The cmd ID.
 * @param {string} formData.ID - The primary key for cmd ID.*
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

export const cmdupdateController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }
    // Prepare the body object with sanitized data
    const body = {
      target: titleCaseFirstWord(formData?.target),
      subTarget: titleCaseFirstWord(formData.subTarget),
      incorporationCity: titleCaseFirstWord(formData?.incorporationCity),
      sectorClassification: titleCaseFirstWord(formData?.sectorClassification),
    };
    // Send the PUT request to the cmd API endpoint
    const response = await put(`/cmd/updatecmd/${formData.ID}`, body, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a cmd with the given ID.
 *
 * @async
 * @function cmddeleteController
 * @param {number} cmdId - The ID of the cmd to delete.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the cmd ID is invalid or the API request fails.
 * @example
 * cmddeleteController(123)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const cmddeleteController = async (cmdId) => {
  try {
    // Data Validation and Sanitization
    if (typeof cmdId !== "number") {
      throw new Error("Invalid form data");
    }
    // Send the DELETE request to the cmd API endpoint
    const response = await remove(`/cmd/deletecmd/${cmdId}`, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
