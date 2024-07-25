import {
  get,
  post,
  remove,
  put,
} from "../../utilities/apiservices/apiServices";
import { titleCaseFirstWord } from "../../utilities/generals";

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
export const getCMDController = async () => {
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

export const cmdCreationController = async (formData) => {
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
