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
    // Send the GET request to the submenu API endpoint
    const response = await get("/submenu", "python");
    // Return the response data
    return response;
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
 * @param {string} formData.menu.ID - The menu ID.
 * @param {string} formData.name - The submenu name.
 * @param {string} formData.description - The submenu description.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   menu: { ID: "menu123" },
 *   name: "New SubMenu",
 *   description: "Description of the new submenu"
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
    // Send the POST request to the submenu API endpoint
    const response = await post("/submenu", body, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing submenu with the given form data.
 *
 * @async
 * @function subMenuUpdateController
 * @param {Object} formData - The form data for updating the submenu.
 * @param {string} formData.ID - The primary key for submenu ID.
 * @param {Object} formData.menu - The menu object.
 * @param {string} formData.menu.ID - The menu ID.
 * @param {string} formData.name - The submenu name.
 * @param {string} formData.description - The submenu description.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   ID: "subMenu123",
 *   menu: { ID: "menu123" },
 *   name: "Updated SubMenu",
 *   description: "Updated description of the submenu"
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
    // Send the PUT request to the submenu API endpoint
    const response = await put(
      `/submenu?id=${formData.ID}`,
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
    if (typeof subMenuID !== "number") {
      throw new Error("Invalid form data");
    }
    // Send the DELETE request to the submenu API endpoint
    const response = await remove(`/submenu?id=${subMenuID}`, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
