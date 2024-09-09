import {
  get,
  post,
  put,
  remove,
} from "../../utilities/apiservices/apiServices";
import { titleCaseFirstWord } from "../../utilities/generals";

/**
 * Fetches the list of projectTypess from the API.
 *
 * @async
 * @function getprojectTypesController
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the API request fails.
 * @example
 * getprojectTypesController()
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const getprojectTypesController = async () => {
  try {
    // Send the GET request to the projectTypes API endpoint
    const response = await get("/master/AllProjectTypes", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new projectTypes with the given form data.
 *
 * @async
 * @function projectTypesCreationController
 * @param {Object} formData - The form data for the new projectTypes.
 * @param {string} formData.name - The projectTypes name.
 * @param {string} formData.description - The projectTypes description.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   name: "tester",
 *   description: "no description"
 * };
 * projectTypesCreationController(formData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const projectTypesCreationController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    // Prepare the body object with sanitized data
    const body = {
      name: titleCaseFirstWord(formData.name.trim()),
      // description: titleCaseFirstWord(formData.description.trim()),
    };
    // Send the POST request to the projectTypes API endpoint
    const response = await post("/projectTypes/projectTypess", body, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing projectTypes with the given form data.
 *
 * @async
 * @function projectTypesupdateController
 * @param {Object} formData - The form data for updating the projectTypes.
 * @param {string} formData.name - The projectTypes name.
 * @param {string} formData.description - The projectTypes description.
 * @param {string} formData.ID - The primary key for projectTypes ID.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   name: "tester",
 *   description: "no description",
 *   ID: 123
 * };
 * projectTypesupdateController(formData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const projectTypesupdateController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    // Prepare the body object with sanitized data
    const body = {
      name: titleCaseFirstWord(formData.name.trim()),
      // description: titleCaseFirstWord(formData.description.trim()),
    };
    // Send the PUT request to the projectTypes API endpoint
    const response = await put(
      `/projectTypes/updateprojectTypes/${formData.ID}`,
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
 * Deletes a projectTypes with the given ID.
 *
 * @async
 * @function projectTypesdeleteController
 * @param {number} projectTypesId - The ID of the projectTypes to delete.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the projectTypes ID is invalid or the API request fails.
 * @example
 * projectTypesdeleteController(123)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const projectTypesdeleteController = async (projectTypesId) => {
  try {
    // Data Validation and Sanitization
    if (!projectTypesId) {
      throw new Error("Invalid projectTypes ID");
    }
    // Send the DELETE request to the projectTypes API endpoint
    const response = await remove(
      `projectTypes/deleteprojectTypess/${projectTypesId}`,
      "python"
    );
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
