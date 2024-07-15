import {
  get,
  post,
  put,
  remove,
} from "../../../utilities/apiservices/apiServices";
import { titleCaseFirstWord } from "../../../utilities/generals";

/**
 * Fetches the list of rolePermissions from the API.
 *
 * @async
 * @function getrolePermissionsController
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the API request fails.
 * @example
 * getrolePermissionsController()
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const getPermissionList = async () => {
  try {
    // Send the GET request to the permission API endpoint
    const response = await get("/master/permission", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new permission with the given form data.
 *
 * @async
 * @function rolePermissionCreationController
 * @param {Object} formData - The form data for the new permission.
 * @param {string} formData.name - The permission name.
 * @param {string} formData.description - The permission description.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   name: "tester",
 *   description: "no description"
 * };
 * rolePermissionCreationController(formData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const rolePermissionCreationController = async (formData) => {
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
    // Send the POST request to the permission API endpoint
    const response = await post("/master/permission", body, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing permission with the given form data.
 *
 * @async
 * @function rolePermissionUpdateController
 * @param {Object} formData - The form data for updating the permission.
 * @param {string} formData.name - The permission name.
 * @param {string} formData.description - The permission description.
 * @param {string} formData.ID - The primary key for permission ID.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   name: "tester",
 *   description: "no description",
 *   ID: 123
 * };
 * rolePermissionupdateController(formData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const rolePermissionUpdateController = async (formData) => {
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
    // Send the PUT request to the permission API endpoint
    const response = await put(
      `/master/permission?id=${formData.ID}`,
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
 * Deletes a permission with the given ID.
 *
 * @async
 * @function rolePermissionDeleteController
 * @param {number} rolePermissionId - The ID of the permission to delete.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the permission ID is invalid or the API request fails.
 * @example
 * rolePermissiondeleteController(123)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const rolePermissionDeleteController = async (rolePermissionId) => {
  try {
    // Data Validation and Sanitization
    if (typeof rolePermissionId !== "number") {
      throw new Error("Invalid permission ID");
    }
    // Send the DELETE request to the permission API endpoint
    const response = await remove(
      `/master/permission?id=${rolePermissionId}`,
      "python"
    );
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
