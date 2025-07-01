import {
  get,
  post,
  remove,
  put,
} from "../../utilities/apiservices/apiServices";
import { getCookie } from "../../utilities/cookieServices/cookieServices";
import { isUserIdCookieName, titleCaseFirstWord } from "../../utilities/generals";
import { decodeData } from "../../utilities/securities/encodeDecode";

/**
 * Fetches the list of cads from the API.
 *
 * @async
 * @function getCADController
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the API request fails.
 * @example
 * getCADController()
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const getCADController = async () => {
  try {
    // Send the GET request to the cad API endpoint
    const response = await get("cmd/allCAD", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
   * Creates a new cad with the given form data.
   *
   * @async
   * @function cadCreationController
   * @param {Object} formData - The form data for the new cad.
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
   * cadCreationController(formData)
   *   .then(response => console.log(response))
   *   .catch(error => console.error(error));
   */

export const cadCreationController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }
    // Prepare the body object with sanitized data
    const body = {
      countryOfResidence: titleCaseFirstWord(formData?.countryOfResidence),
      target: titleCaseFirstWord(formData?.target),
      emiratesId: titleCaseFirstWord(formData.emiratesId),
      incorporationCity: titleCaseFirstWord(formData?.incorporationCity),
      sectorClassification: titleCaseFirstWord(formData?.sectorClassification),
      updatedBy: decodeData(getCookie(isUserIdCookieName))
    };
    // Send the POST request to the cad API endpoint
    const response = await post("cmd/addCAD", body, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing cad with the given form data.
 *
 * @async
 * @function cadupdateController
 * @param {Object} formData - The form data for updating the cad.
 * @param {string} formData.cadId - The cad ID.
 * @param {string} formData.ID - The primary key for cad ID.*
 * @param {string} formData.firstName - The first name.
 * @param {string} formData.lastName - The last name.
 * @param {string} formData.email - The email address.
 * @param {string} formData.mobileNo - The mobile number.
 * @param {Object|string} formData.role - The role object or role ID.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   cadId: "123",
 *   firstName: "John",
 *   lastName: "Doe",
 *   email: "john.doe@example.com",
 *   mobileNo: "1234567890",
 *   role: { ID: "admin", NAME: "Admin" }
 * };
 * cadupdateController(formData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */

export const cadupdateController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }
    // Prepare the body object with sanitized data
    const body = {
      countryOfResidence: titleCaseFirstWord(formData?.countryOfResidence),
      target: titleCaseFirstWord(formData?.target),
      emiratesId: titleCaseFirstWord(formData.emiratesId),
      incorporationCity: titleCaseFirstWord(formData?.incorporationCity),
      sectorClassification: titleCaseFirstWord(formData?.sectorClassification),
      updatedBy: decodeData(getCookie(isUserIdCookieName))
    };
    // Send the PUT request to the cad API endpoint
    const response = await put(`/cmd/updateCAD/${formData.ID}`, body, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a cad with the given ID.
 *
 * @async
 * @function caddeleteController
 * @param {number} cadId - The ID of the cad to delete.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the cad ID is invalid or the API request fails.
 * @example
 * caddeleteController(123)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const caddeleteController = async (cadId) => {
  try {
    // Data Validation and Sanitization
    if (typeof cadId !== "number") {
      throw new Error("Invalid form data");
    }
    // Send the DELETE request to the cad API endpoint
    const response = await remove(`cmd/deleteCAD/${cadId}`, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
