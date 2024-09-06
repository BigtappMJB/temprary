import {
  get,
  post,
  put,
  remove,
} from "../../utilities/apiservices/apiServices";
import { titleCaseFirstWord } from "../../utilities/generals";

/**
 * Fetches the list of projectRoless from the API.
 *
 * @async
 * @function getprojectRolesController
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the API request fails.
 * @example
 * getprojectRolesController()
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const getprojectRolesController = async () => {
  try {
    // Send the GET request to the projectRoles API endpoint
    const response = await get("/master/AllProjectRoles", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new projectRoles with the given form data.
 *
 * @async
 * @function projectRolesCreationController
 * @param {Object} formData - The form data for the new projectRoles.
 * @param {string} formData.name - The projectRoles name.
 * @param {string} formData.description - The projectRoles description.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   name: "tester",
 *   description: "no description"
 * };
 * projectRolesCreationController(formData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const projectRolesCreationController = async (formData) => {
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
    // Send the POST request to the projectRoles API endpoint
    const response = await post("/master/AllProjectRoles", body, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing projectRoles with the given form data.
 *
 * @async
 * @function projectRolesupdateController
 * @param {Object} formData - The form data for updating the projectRoles.
 * @param {string} formData.name - The projectRoles name.
 * @param {string} formData.description - The projectRoles description.
 * @param {string} formData.ID - The primary key for projectRoles ID.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   name: "tester",
 *   description: "no description",
 *   ID: 123
 * };
 * projectRolesupdateController(formData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const projectRolesupdateController = async (formData) => {
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
    // Send the PUT request to the projectRoles API endpoint
    const response = await put(
      `/master/AllProjectRoles/${formData.ID}`,
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
 * Deletes a projectRoles with the given ID.
 *
 * @async
 * @function projectRolesdeleteController
 * @param {number} projectRolesId - The ID of the projectRoles to delete.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the projectRoles ID is invalid or the API request fails.
 * @example
 * projectRolesdeleteController(123)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const projectRolesdeleteController = async (projectRolesId) => {
  try {
    // Data Validation and Sanitization
    if (typeof projectRolesId !== "number") {
      throw new Error("Invalid projectRoles ID");
    }
    // Send the DELETE request to the projectRoles API endpoint
    const response = await remove(
      `master/AllProjectRoles${projectRolesId}`,
      "python"
    );
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
