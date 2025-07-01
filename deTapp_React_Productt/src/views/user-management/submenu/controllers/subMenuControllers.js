import {
  get,
  post,
  put,
  remove,
} from "../../../utilities/apiservices/apiServices";
import { titleCaseFirstWord } from "../../../utilities/generals";

/**
 * Fetches the list of submenus from the API.
 *
 * @async
 * @function getSubMenusController
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the API request fails.
 * @example
 * getSubMenusController()
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const getSubMenusController = async () => {
  try {
    // Try the new API endpoint first
    try {
      const response = await get("/api/submenus", "python");
      // Return the response data
      return response.data || response;
    } catch (newApiError) {
      // If the new API fails, fall back to the old endpoint
      console.log("Falling back to old API endpoint");
      const response = await get("/submenu", "python");
      return response;
    }
  } catch (error) {
    console.error("Error fetching submenus:", error);
    throw error;
  }
};

/**
 * Fetches a specific submenu by ID from the API.
 *
 * @async
 * @function getSubMenuByIdController
 * @param {number} subMenuId - The ID of the submenu to fetch.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the API request fails.
 * @example
 * getSubMenuByIdController(1)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const getSubMenuByIdController = async (subMenuId) => {
  try {
    // Data Validation
    if (!subMenuId) {
      throw new Error("Submenu ID is required");
    }
    
    // Send the GET request to the submenu API endpoint
    const response = await get(`/api/submenus/${subMenuId}`, "python");
    // Return the response data
    return response.data || response;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches all submenus for a specific menu.
 *
 * @async
 * @function getSubMenusByMenuIdController
 * @param {number} menuId - The ID of the menu to fetch submenus for.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the API request fails.
 * @example
 * getSubMenusByMenuIdController(1)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const getSubMenusByMenuIdController = async (menuId) => {
  try {
    // Data Validation
    if (!menuId) {
      throw new Error("Menu ID is required");
    }
    
    // Send the GET request to the submenu API endpoint
    const response = await get(`/api/menus/${menuId}/submenus`, "python");
    // Return the response data
    return response.data || response;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new submenu with the given form data.
 *
 * @async
 * @function subMenuCreationController
 * @param {Object} formData - The form data for the new submenu.
 * @param {Object} formData.menu - The menu object.
 * @param {number} formData.menu.ID - The menu ID.
 * @param {string} formData.name - The submenu name.
 * @param {string} formData.description - The submenu description.
 * @param {string} formData.path - The route path for the submenu.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   menu: { ID: 1 },
 *   name: "New SubMenu",
 *   description: "Description of the new submenu",
 *   path: "/dashboard/new"
 * };
 * subMenuCreationController(formData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const subMenuCreationController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }
    
    // Prepare the body object with sanitized data
    const body = {
      menu_id: formData?.menu.ID,
      name: titleCaseFirstWord(formData.name.trim()),
      description: titleCaseFirstWord(formData.description.trim()),
      route: formData?.path.trim(),
    };
    
    // Try the new API endpoint first
    try {
      // Send the POST request to the new submenu API endpoint
      const response = await post("/api/submenus", body, "python");
      return response;
    } catch (newApiError) {
      // If the new API fails, fall back to the old endpoint
      console.log("Falling back to old submenu creation API endpoint");
      const response = await post("/submenu", body, "python");
      return response;
    }
  } catch (error) {
    console.error("Error creating submenu:", error);
    throw error;
  }
};

/**
 * Updates an existing submenu with the given form data.
 *
 * @async
 * @function subMenuUpdateController
 * @param {Object} formData - The form data for updating the submenu.
 * @param {number} formData.ID - The primary key for submenu ID.
 * @param {Object} formData.menu - The menu object.
 * @param {number} formData.menu.ID - The menu ID.
 * @param {string} formData.name - The submenu name.
 * @param {string} formData.description - The submenu description.
 * @param {string} formData.path - The route path for the submenu.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   ID: 3,
 *   menu: { ID: 1 },
 *   name: "Updated SubMenu",
 *   description: "Updated description of the submenu",
 *   path: "/dashboard/updated"
 * };
 * subMenuUpdateController(formData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const subMenuUpdateController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    // Prepare the body object with sanitized data
    const body = {
      menu_id: formData?.menu.ID,
      name: titleCaseFirstWord(formData.name.trim()),
      description: titleCaseFirstWord(formData.description.trim()),
      route: formData?.path.trim(),
    };
    
    // Try the new API endpoint first
    try {
      // Send the PUT request to the new submenu API endpoint
      const response = await put(
        `/api/submenus/${formData.ID}`,
        body,
        "python"
      );
      return response;
    } catch (newApiError) {
      // If the new API fails, fall back to the old endpoint
      console.log("Falling back to old submenu update API endpoint");
      const response = await put(
        `/submenu?id=${formData.ID}`,
        body,
        "python"
      );
      return response;
    }
    
  } catch (error) {
    console.error("Error updating submenu:", error);
    throw error;
  }
};

/**
 * Deletes a submenu with the given ID.
 *
 * @async
 * @function subMenuDeleteController
 * @param {number} subMenuID - The ID of the submenu to delete.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the submenu ID is invalid or the API request fails.
 * @example
 * subMenuDeleteController(123)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const subMenuDeleteController = async (subMenuID) => {
  try {
    // Data Validation and Sanitization
    if (!subMenuID) {
      throw new Error("Invalid submenu ID");
    }
    
    // Try the new API endpoint first
    try {
      // Send the DELETE request to the new submenu API endpoint
      const response = await remove(`/api/submenus/${subMenuID}`, "python");
      return response;
    } catch (newApiError) {
      // If the new API fails, fall back to the old endpoint
      console.log("Falling back to old submenu delete API endpoint");
      const response = await remove(`/submenu?id=${subMenuID}`, "python");
      return response;
    }
  } catch (error) {
    console.error("Error deleting submenu:", error);
    throw error;
  }
};
