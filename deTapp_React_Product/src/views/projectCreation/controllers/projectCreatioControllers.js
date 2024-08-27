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
    const response = await get("projectCreation/Allcmd", "python");
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
    // Prepare the body object with sanitized data
    const body = {
      target: titleCaseFirstWord(formData?.target),
      subTarget: titleCaseFirstWord(formData.subTarget),
      incorporationCity: titleCaseFirstWord(formData?.incorporationCity),
      sectorClassification: titleCaseFirstWord(formData?.sectorClassification),
    };
    // Send the POST request to the projectCreation API endpoint
    const response = await post("projectCreation/addprojectCreation", body, "python");
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
    const body = {
      target: titleCaseFirstWord(formData?.target),
      subTarget: titleCaseFirstWord(formData.subTarget),
      incorporationCity: titleCaseFirstWord(formData?.incorporationCity),
      sectorClassification: titleCaseFirstWord(formData?.sectorClassification),
    };
    // Send the PUT request to the projectCreation API endpoint
    const response = await put(`/projectCreation/updatecmd/${formData.ID}`, body, "python");
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
    const response = await remove(`/projectCreation/deletecmd/${cmdId}`, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
