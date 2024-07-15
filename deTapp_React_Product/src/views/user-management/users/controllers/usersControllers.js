import {
  get,
  post,
  put,
  remove,
} from "../../../utilities/apiservices/apiServices";
import { titleCaseFirstWord } from "../../../utilities/generals";

/**
 * Fetches the list of users from the API.
 *
 * @async
 * @function getUserController
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the API request fails.
 * @example
 * getUserController()
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const getUserController = async () => {
  try {
    // Send the GET request to the user API endpoint
    const response = await get("/master/user", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

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
    // Send the GET request to the role API endpoint
    const response = await get("/master/role", "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new user with the given form data.
 *
 * @async
 * @function userCreationController
 * @param {Object} formData - The form data for the new user.
 * @param {string} formData.userId - The user ID.
 * @param {string} formData.firstName - The first name.
 * @param {string} formData.lastName - The last name.
 * @param {string} formData.email - The email address.
 * @param {string} formData.mobileNo - The mobile number.
 * @param {Object|string} formData.role - The role object or role ID.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   userId: "123",
 *   firstName: "John",
 *   lastName: "Doe",
 *   email: "john.doe@example.com",
 *   mobileNo: "1234567890",
 *   role: { ID: "admin", NAME: "Admin" }
 * };
 * userCreationController(formData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const userCreationController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    // Prepare the body object with sanitized data
    const body = {
      userId: formData?.userId.trim(),
      firstName: titleCaseFirstWord(formData.firstName.trim()),
      lastName: titleCaseFirstWord(formData?.lastName.trim()),
      email: formData.email.trim(),
      mobile: formData.mobileNo.trim(),
      role: formData.role?.ID ?? formData.role,
    };
    // Send the POST request to the user API endpoint
    const response = await post("/master/user", body, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing user with the given form data.
 *
 * @async
 * @function userupdateController
 * @param {Object} formData - The form data for updating the user.
 * @param {string} formData.userId - The user ID.
 * @param {string} formData.ID - The primary key for user ID.*
 * @param {string} formData.firstName - The first name.
 * @param {string} formData.lastName - The last name.
 * @param {string} formData.email - The email address.
 * @param {string} formData.mobileNo - The mobile number.
 * @param {Object|string} formData.role - The role object or role ID.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {
 *   userId: "123",
 *   firstName: "John",
 *   lastName: "Doe",
 *   email: "john.doe@example.com",
 *   mobileNo: "1234567890",
 *   role: { ID: "admin", NAME: "Admin" }
 * };
 * userupdateController(formData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const userupdateController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    // Prepare the body object with sanitized data
    const body = {
      userId: formData?.userId.trim(),
      firstName: titleCaseFirstWord(formData.firstName.trim()),
      lastName: titleCaseFirstWord(formData?.lastName.trim()),
      email: formData.email.trim(),
      mobile: formData.mobileNo.trim(),
      role: formData.role?.ID ?? formData.role,
    };
    // Send the PUT request to the user API endpoint
    const response = await put(
      `/master/user?id=${formData.ID}`,
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
 * Deletes a user with the given ID.
 *
 * @async
 * @function userdeleteController
 * @param {number} userId - The ID of the user to delete.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the user ID is invalid or the API request fails.
 * @example
 * userdeleteController(123)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const userdeleteController = async (userId) => {
  try {
    // Data Validation and Sanitization
    if (typeof userId !== "number") {
      throw new Error("Invalid form data");
    }
    // Send the DELETE request to the user API endpoint
    const response = await remove(`/master/user?id=${userId}`, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
