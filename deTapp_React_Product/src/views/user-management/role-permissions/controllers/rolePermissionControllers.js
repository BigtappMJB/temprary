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
export const getRolePermissionsController = async () => {
  try {
    // Send the GET request to the rolePermissionPermission API endpoint
    const response = await get("/master/rolePermission", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new rolePermissionPermission with the given form data.
 *
 * @async
 * @function rolePermissionCreationController
 * @param {Object} formData - The form data for the new rolePermissionPermission.
 * @param {string} formData.name - The rolePermissionPermission name.
 * @param {string} formData.description - The rolePermissionPermission description.
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
      role_id: formData.role?.ID,
      menu_id: formData.menu?.ID,
      submenu_id: formData.subMenu?.ID,
      permission_level: formData.permission?.ID,
    };
    // Send the POST request to the rolePermissionPermission API endpoint
    const response = await post("/master/rolePermission", body, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing rolePermissionPermission with the given form data.
 *
 * @async
 * @function rolePermissionUpdateController
 * @param {Object} formData - The form data for updating the rolePermissionPermission.
 * @param {string} formData.name - The rolePermissionPermission name.
 * @param {string} formData.description - The rolePermissionPermission description.
 * @param {string} formData.ID - The primary key for rolePermissionPermission ID.
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
      role_id: formData.role?.ID,
      menu_id: formData.menu?.ID,
      submenu_id: formData.subMenu?.ID,
      permission_level: formData.permission?.ID,
    };
    // Send the PUT request to the rolePermissionPermission API endpoint
    const response = await put(
      `/master/rolePermission?id=${formData.ID}`,
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
 * Deletes a rolePermissionPermission with the given ID.
 *
 * @async
 * @function rolePermissionDeleteController
 * @param {number} rolePermissionId - The ID of the rolePermissionPermission to delete.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the rolePermissionPermission ID is invalid or the API request fails.
 * @example
 * rolePermissiondeleteController(123)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const rolePermissionDeleteController = async (rolePermissionId) => {
  try {
    // Data Validation and Sanitization
    if (typeof rolePermissionId !== "number") {
      throw new Error("Invalid rolePermissionPermission ID");
    }
    // Send the DELETE request to the rolePermissionPermission API endpoint
    const response = await remove(
      `/master/rolePermission?id=${rolePermissionId}`,
      "python"
    );
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
