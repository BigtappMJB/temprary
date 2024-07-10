import axios from "../config/axios";

/**
 * Makes a GET request to the specified URL.
 *
 * @param {string} url - The URL to make the GET request to.
 * @returns {Promise<any>} - The response data from the server.
 * @throws {Error} - If the request fails, an error with a statusCode and errorMessage will be thrown.
 *
 * @example
 * const userData = await get('https://api.example.com/users/me');
 * console.log(userData); // { id: 1, name: 'John Doe', email: 'johndoe@example.com' }
 */
const get = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

/**
 * Makes a POST request to the specified URL with the provided data.
 *
 * @param {string} url - The URL to make the POST request to.
 * @param {object} data - The data to send with the request.
 * @returns {Promise<any>} - The response data from the server.
 * @throws {Error} - If the request fails, an error with a statusCode and errorMessage will be thrown.
 *
 * @example
 * const newData = { name: 'Jane Doe', email: 'janedoe@example.com' };
 * const response = await post('https://api.example.com/users', newData);
 * console.log(response); // { id: 2, name: 'Jane Doe', email: 'janedoe@example.com' }
 */
const post = async (url, data) => {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

/**
 * Makes a PUT request to the specified URL with the provided data.
 *
 * @param {string} url - The URL to make the PUT request to.
 * @param {object} data - The data to send with the request.
 * @returns {Promise<any>} - The response data from the server.
 * @throws {Error} - If the request fails, an error with a statusCode and errorMessage will be thrown.
 *
 * @example
 * const updatedData = { name: 'Jane Doe', email: 'janedoe@example.com' };
 * const response = await put('https://api.example.com/users/2', updatedData);
 * console.log(response); // { id: 2, name: 'Jane Doe', email: 'janedoe@example.com' }
 */
const put = async (url, data) => {
  try {
    const response = await axios.put(url, data);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

/**
 * Makes a DELETE request to the specified URL.
 *
 * @param {string} url - The URL to make the DELETE request to.
 * @returns {Promise<any>} - The response data from the server.
 * @throws {Error} - If the request fails, an error with a statusCode and errorMessage will be thrown.
 *
 * @example
 * const response = await remove('https://api.example.com/users/2');
 * console.log(response); // {}
 */
const remove = async (url) => {
  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

/**
 * Handles Axios errors by extracting the status code and error message.
 *
 * @param {Error} error - The Axios error object.
 * @returns {Error} - An error object with a statusCode and errorMessage.
 */
const handleAxiosError = (error) => {
  // Log the original error for debugging
  // console.error("Error in Axios request:", error);
  // Default values
  let statusCode = 500;
  let errorMessage = "An unknown error occurred.";

  // Check if the error response is defined
  if (error.response) {
    // Server responded with a status other than 200 range
    statusCode = error.response.status;
    errorMessage = error.response.statusText || errorMessage;

    // You can also include more detailed information if available
    if (error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
  } else if (error.request) {
    // Request was made but no response was received
    errorMessage = "No response received from the server.";
  } else {
    // Something happened in setting up the request
    errorMessage = error.message;
  }

  return { statusCode, errorMessage };
};

export { get, post, put, remove };