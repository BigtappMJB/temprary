import {
  get,
  post,
  put,
  remove,
} from "../../utilities/apiservices/apiServices";
import { getCookie } from "../../utilities/cookieServices/cookieServices";
import { isUserIdCookieName, titleCaseFirstWord } from "../../utilities/generals";
import { decodeData } from "../../utilities/securities/encodeDecode";

/**
 * Fetches the list of clients from the API.
 *
 * @async
 * @function getRolesController
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the API request fails.
 * @example
 * getRolesController()
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const getRolesController = async () => {
  try {
    // Send the GET request to the client API endpoint
    const response = await get("/master/AllClients", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new client with the given form data.
 *
 * @async
 * @function clientCreationController
 * @param {Object} formData - The form data for the new client.
 * @param {string} formData.name - The client name.
 * @param {string} formData.description - The client description.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   name: "tester",
 *   description: "no description"
 * };
 * clientCreationController(formData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const clientCreationController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    // Prepare the body object with sanitized data
    const body = {
      clientName: titleCaseFirstWord(formData.name.trim()),
      createdBy:decodeData(getCookie(isUserIdCookieName)),
      isActive: 1,
    };
    // Send the POST request to the client API endpoint
    const response = await post("/master/createClient", body, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing client with the given form data.
 *
 * @async
 * @function clientupdateController
 * @param {Object} formData - The form data for updating the client.
 * @param {string} formData.name - The client name.
 * @param {string} formData.description - The client description.
 * @param {string} formData.ID - The primary key for client ID.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   name: "tester",
 *   description: "no description",
 *   ID: 123
 * };
 * clientupdateController(formData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const clientupdateController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    // Prepare the body object with sanitized data
    const body = {
      name: titleCaseFirstWord(formData.name.trim()),
    };
    // Send the PUT request to the client API endpoint
    const response = await put(
      `/client/updateclient/${formData.ID}`,
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
 * Deletes a client with the given ID.
 *
 * @async
 * @function clientdeleteController
 * @param {number} clientId - The ID of the client to delete.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the client ID is invalid or the API request fails.
 * @example
 * clientdeleteController(123)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const clientdeleteController = async (clientId) => {
  try {
    // Data Validation and Sanitization
    if (typeof clientId !== "number") {
      throw new Error("Invalid client ID");
    }
    // Send the DELETE request to the client API endpoint
    const response = await remove(`client/deleteclients/${clientId}`, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
