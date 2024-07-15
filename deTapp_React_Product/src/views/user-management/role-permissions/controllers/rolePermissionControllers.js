import {
  get,
  post,
  put,
  remove,
} from "../../../utilities/apiservices/apiServices";
import { titleCaseFirstWord } from "../../../utilities/generals";

/**
 * Fetches the list of role permissions from the API.
 *
 * @async
 * @function getRolePermissionsController
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the API request fails.
 * @example
 * getRolePermissionsController()
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const getRolePermissionsController = async () => {
  try {
    // Send the GET request to the role permissions API endpoint
    const response = await get("/master/rolePermission", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new role permission with the given form data.
 *
 * @async
 * @function rolePermissionCreationController
 * @param {Object} formData - The form data for the new role permission.
 * @param {Object} formData.role - The role object containing role ID.
 * @param {Object} formData.menu - The menu object containing menu ID.
 * @param {Object} formData.subMenu - The submenu object containing submenu ID.
 * @param {Object} formData.permission - The permission object containing permission level ID.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   role: { ID: "role123" },
 *   menu: { ID: "menu123" },
 *   subMenu: { ID: "subMenu123" },
 *   permission: { ID: "perm123" }
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
    // Send the POST request to the role permissions API endpoint
    const response = await post("/master/rolePermission", body, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing role permission with the given form data.
 *
 * @async
 * @function rolePermissionUpdateController
 * @param {Object} formData - The form data for updating the role permission.
 * @param {Object} formData.role - The role object containing role ID.
 * @param {Object} formData.menu - The menu object containing menu ID.
 * @param {Object} formData.subMenu - The submenu object containing submenu ID.
 * @param {Object} formData.permission - The permission object containing permission level ID.
 * @param {string} formData.ID - The primary key for role permission ID.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   role: { ID: "role123" },
 *   menu: { ID: "menu123" },
 *   subMenu: { ID: "subMenu123" },
 *   permission: { ID: "perm123" },
 *   ID: 123
 * };
 * rolePermissionUpdateController(formData)
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
    // Send the PUT request to the role permissions API endpoint
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
 * Deletes a role permission with the given ID.
 *
 * @async
 * @function rolePermissionDeleteController
 * @param {number} rolePermissionId - The ID of the role permission to delete.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the role permission ID is invalid or the API request fails.
 * @example
 * rolePermissionDeleteController(123)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const rolePermissionDeleteController = async (rolePermissionId) => {
  try {
    // Data Validation and Sanitization
    if (typeof rolePermissionId !== "number") {
      throw new Error("Invalid role permission ID");
    }
    // Send the DELETE request to the role permissions API endpoint
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
