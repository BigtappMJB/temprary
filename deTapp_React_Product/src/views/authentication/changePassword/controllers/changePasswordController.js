import { post } from "../../../utilities/apiservices/apiServices";

/**
 * changePasswordController - Handles the login process by sending user credentials to the API.
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
 * changePasswordController(formData)
 *   .then(response => {
 *     console.log('Login successful:', response);
 *   })
 *   .catch(error => {
 *     console.error('Login failed:', error.message);
 *   });
 */
export const changePasswordController = async (formData) => {
  try {
    // Validate and sanitize input data
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    const { username, password } = formData;

    if (typeof username !== "string" || typeof password !== "string") {
      throw new Error("Username and password must be strings");
    }

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      throw new Error("Username and password cannot be empty");
    }

    // Prepare the body object with sanitized data
    const body = {
      login_id: trimmedUsername,
      password: trimmedPassword,
    };

    // Send the POST request to the user API endpoint
    const response = await post("/login", body, "python");

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
