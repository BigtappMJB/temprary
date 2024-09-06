import {
  get,
  post,
  put,
  remove,
} from "../../utilities/apiservices/apiServices";
import { titleCaseFirstWord } from "../../utilities/generals";

/**
 * Fetches the list of projectPhasess from the API.
 *
 * @async
 * @function getprojectPhasesController
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the API request fails.
 * @example
 * getprojectPhasesController()
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const getprojectPhasesController = async () => {
  try {
    // Send the GET request to the projectPhases API endpoint
    const response = await get("/master/AllProjectPhases", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new projectPhases with the given form data.
 *
 * @async
 * @function projectPhasesCreationController
 * @param {Object} formData - The form data for the new projectPhases.
 * @param {string} formData.name - The projectPhases name.
 * @param {string} formData.description - The projectPhases description.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   name: "tester",
 *   description: "no description"
 * };
 * projectPhasesCreationController(formData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const projectPhasesCreationController = async (formData) => {
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
    // Send the POST request to the projectPhases API endpoint
    const response = await post("master/AllProjectPhases", body, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing projectPhases with the given form data.
 *
 * @async
 * @function projectPhasesupdateController
 * @param {Object} formData - The form data for updating the projectPhases.
 * @param {string} formData.name - The projectPhases name.
 * @param {string} formData.description - The projectPhases description.
 * @param {string} formData.ID - The primary key for projectPhases ID.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   name: "tester",
 *   description: "no description",
 *   ID: 123
 * };
 * projectPhasesupdateController(formData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const projectPhasesupdateController = async (formData) => {
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
    // Send the PUT request to the projectPhases API endpoint
    const response = await put(
      `master/AllProjectPhases/${formData.ID}`,
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
 * Deletes a projectPhases with the given ID.
 *
 * @async
 * @function projectPhasesdeleteController
 * @param {number} projectPhasesId - The ID of the projectPhases to delete.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the projectPhases ID is invalid or the API request fails.
 * @example
 * projectPhasesdeleteController(123)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const projectPhasesdeleteController = async (projectPhasesId) => {
  try {
    // Data Validation and Sanitization
    if (typeof projectPhasesId !== "number") {
      throw new Error("Invalid projectPhases ID");
    }
    // Send the DELETE request to the projectPhases API endpoint
    const response = await remove(
      `projectPhases/deleteprojectPhasess/${projectPhasesId}`,
      "python"
    );
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
