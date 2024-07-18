import { post } from "../../../utilities/apiservices/apiServices";
import { getCookie } from "../../../utilities/cookieServices/cookieServices";
import {
  encodedTempUsersCookieName,
  isForgotPasswordCookieName,
} from "../../../utilities/generals";
import { decodeData } from "../../../utilities/securities/encodeDecode";

/**
 * emailVerifyCodeController - Handles the login process by sending user credentials to the API.
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
 * emailVerifyCodeController(formData)
 *   .then(response => {
 *     console.log('Login successful:', response);
 *   })
 *   .catch(error => {
 *     console.error('Login failed:', error.message);
 *   });
 */
export const emailVerifyCodeController = async (formData) => {
  try {
    // Validate and sanitize input data
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    const userDetails = decodeData(getCookie(encodedTempUsersCookieName));
    const isForgotPasswordEmail = getCookie(isForgotPasswordCookieName);
    // Prepare the body object with sanitized data
    const body = {
      email: isForgotPasswordEmail ?? userDetails.email,
      otp: formData?.code,
    };

    // Send the POST request to the user API endpoint
    const response = await post("/register/verify_otp", body, "python");

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
