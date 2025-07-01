import { post } from "../../../utilities/apiservices/apiServices";
import { getCookie } from "../../../utilities/cookieServices/cookieServices";
import { isUserIdCookieName } from "../../../utilities/generals";
import { decodeData } from "../../../utilities/securities/encodeDecode";

/**
 * Handles the login process by sending user credentials to the API.
 *
 * @param {Object} formData - The form data containing user credentials.
 * @param {string} formData.username - The username of the user.
 * @param {string} formData.password - The password of the user.
 *
 * @returns {Promise<Object>} The response data from the API.
 * @throws {Error} Throws an error if the form data is invalid or if the API request fails.
 *
 * @example
 *
 * const formData = {
 *   username: 'exampleUser',
 *   password: 'examplePass123'
 * };
 *
 * loginController(formData)
 *   .then(response => {
 *     console.log('Login successful:', response);
 *   })
 *   .catch(error => {
 *     console.error('Login failed:', error.message);
 *   });
 */
export const loginController = async (formData) => {
  try {
    // Validate and sanitize input data
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    const { username, password } = formData;

    // Prepare the body object with sanitized data
    const body = {
      email: username.trim(),
      password: password.trim(),
    };

    // Send the POST request to the user API endpoint
    const response = await post("/login", body, "python");

    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Handles the logout process by sending the user's email to the API.
 *
 * @returns {Promise<Object>} The response data from the API.
 * @throws {Error} Throws an error if the API request fails.
 *
 * @example
 *
 * loginOutController()
 *   .then(response => {
 *     console.log('Logout successful:', response);
 *   })
 *   .catch(error => {
 *     console.error('Logout failed:', error.message);
 *   });
 */
export const loginOutController = async () => {
  try {
    // Decode the user email from the cookie
    const email = decodeData(getCookie(isUserIdCookieName));

    // Prepare the body object with the user's email
    const body = {
      login_id: email,
    };

    // Send the POST request to the user API endpoint for logout
    const response = await post("/register/logout", body, "python");

    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
