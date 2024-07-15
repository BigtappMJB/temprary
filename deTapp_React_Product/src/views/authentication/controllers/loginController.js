import { post } from "../../utilities/apiservices/apiServices";

/**
 * loginController - Handles the login process by sending user credentials to the API.
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
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      throw new Error(`API error: ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("Network error: No response received from the server");
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Unexpected error: ${error.message}`);
    }
  }
};
