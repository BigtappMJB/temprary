import {
  get,
  post,
  put,
  remove,
} from "../../../utilities/apiservices/apiServices";
import { titleCaseFirstWord } from "../../../utilities/generals";

/**
 * Fetches the list of roles from the API.
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
    console.log("[DEBUG] Fetching roles from /role/Allroles");
    // Send the GET request to the role API endpoint
    const response = await get("/role/Allroles", "python");
    console.log("Roles response:", response);
    // Return the response data
    return response;
  } catch (error) {
    console.error("Error fetching roles:", error);
    // Return empty array to prevent UI errors
    return [];
  }
};

/**
 * Creates a new role with the given form data.
 *
 * @async
 * @function roleCreationController
 * @param {Object} formData - The form data for the new role.
 * @param {string} formData.name - The role name.
 * @param {string} formData.description - The role description.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   name: "tester",
 *   description: "no description"
 * };
 * roleCreationController(formData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const roleCreationController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    // Prepare the body object with sanitized data
    const body = {
      name: titleCaseFirstWord(formData.name.trim()),
      description: titleCaseFirstWord(formData.description.trim()),
    };
    // Send the POST request to the role API endpoint
    const response = await post("/roles", body, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing role with the given form data.
 *
 * @async
 * @function roleupdateController
 * @param {Object} formData - The form data for updating the role.
 * @param {string} formData.name - The role name.
 * @param {string} formData.description - The role description.
 * @param {string} formData.ID - The primary key for role ID.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   name: "tester",
 *   description: "no description",
 *   ID: 123
 * };
 * roleupdateController(formData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const roleupdateController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    // Prepare the body object with sanitized data
    const body = {
      name: titleCaseFirstWord(formData.name.trim()),
      description: titleCaseFirstWord(formData.description.trim()),
    };
    // Send the PUT request to the role API endpoint
    const response = await put(
      `/role/updaterole/${formData.ID}`,
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
 * Deletes a role with the given ID.
 *
 * @async
 * @function roledeleteController
 * @param {number} roleId - The ID of the role to delete.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the role ID is invalid or the API request fails.
 * @example
 * roledeleteController(123)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const roledeleteController = async (roleId) => {
  try {
    // Data Validation and Sanitization
    if (typeof roleId !== "number") {
      throw new Error("Invalid role ID");
    }
    // Send the DELETE request to the role API endpoint
    const response = await remove(`/role/deleteroles/${roleId}`, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
