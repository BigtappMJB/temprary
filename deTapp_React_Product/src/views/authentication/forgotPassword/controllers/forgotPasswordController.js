import { post } from "../../../utilities/apiservices/apiServices";
import { getCookie } from "../../../utilities/cookieServices/cookieServices";
import {
  isForgotPasswordCookieName,
  isUserIdCookieName,
} from "../../../utilities/generals";
import {
  decodeData,
  encodeData,
} from "../../../utilities/securities/encodeDecode";

/**
 * forgotPasswordController - Handles the login process by sending user credentials to the API.
 *
 * @param {Object} formData - The form data containing user credentials.
 * @param {string} formData.code - The verification code.
 *
 * @returns {Promise<Object>} The response data from the API.
 * @throws {Error} Throws an error if the form data is invalid or if the API request fails.
 *
 * @example
 *
 * const formData = {
 *   code: 'exampleUser',
 * };
 *
 * forgotPasswordController(formData)
 *   .then(response => {
 *     console.log('Login successful:', response);
 *   })
 *   .catch(error => {
 *     console.error('Login failed:', error.message);
 *   });
 */
export const forgotPasswordController = async (formData) => {
  try {
    // Validate and sanitize input data
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    const isForgotPasswordEmail = decodeData(getCookie(isUserIdCookieName));

    // Prepare the body object with sanitized data
    const body = {
      email: isForgotPasswordEmail,
      new_password: encodeData(formData?.newPassword.trim()),
    };

    // Send the POST request to the user API endpoint
    const response = await post("/register/reset_password", body, "python");

    // Check if response is valid
    if (!response || typeof response !== "object") {
      throw new Error("Invalid response from the server");
    }

    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
