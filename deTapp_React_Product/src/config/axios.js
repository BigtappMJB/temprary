/**
 * Creates an springBootInstance of Axios with default headers and security configurations.
 *
 * This springBootInstance is pre-configured with a base URL from the environment variable `REACT_APP_SPRINGBOOT_API_URL`.
 * It also includes various security headers to protect against common web vulnerabilities.
 *
 * @example
 * import axiosInstance from './axiosInstance';
 *
 * axiosInstance.get('/users')
 *  .then(response => {
 *     console.log(response.data);
 *   })
 *  .catch(error => {
 *     console.error(error);
 *   });
 */

import axios from "axios";
export const springBootInstance = axios.create({
  /**
   * Base URL for the API requests.
   * This value is taken from the environment variable `REACT_APP_SPRINGBOOT_API_URL`.
   */
  baseURL: process.env.REACT_APP_SPRINGBOOT_API_URL,
  headers: {
    /**
     * Content-Type header set to application/json.
     */
    "Content-Type": "application/json",
    // Add other headers as needed
  },
});

export const pythonInstance = axios.create({
  /**
   * Base URL for the API requests.
   * This value is taken from the environment variable `REACT_APP_PYTHON_API_URL`.
   */

  baseURL: "http://localhost:5000",
  headers: {
    /**
     * Content-Type header set to application/json.
     */
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
    // Add other headers as needed
  },
});

// Add a request interceptor
pythonInstance.interceptors.request.use(
  (config) => {
    /**
     * Add security headers to the request config.
     */
    //  config.headers["Content-Security-Policy"] = "default-src 'elf'"; // Content Security Policy header
    //  config.headers["X-Content-Type-Options"] = "nosniff"; // X-Content-Type-Options header
    //  config.headers["X-Frame-Options"] = "SAMEORIGIN"; // X-Frame-Options header
    //  config.headers["X-XSS-Protection"] = "1; mode=block"; // X-XSS-Protection header
    //   config.headers["Strict-Transport-Security"] =
    //   "max-age=31536000; includeSubDomains"; // Strict-Transport-Security header
    // config.headers["Referrer-Policy"] = "same-origin"; // Referrer-Policy header
    // config.headers["Feature-Policy"] =
    //   "geolocation 'elf'; microphone 'none'; camera 'none'"; // Feature-Policy header
    // config.headers["Cache-Control"] = "no-store"; // Cache-Control header

    // Retrieve the token from localStorage before each request
    const token = localStorage.getItem("token");

    // If token exists, attach it to the Authorization header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Return the modified request config
    return config;
  },
  (error) => {
    if (!(error instanceof Error)) {
      error = new Error(
        typeof error === "string" ? error : "An unknown error occurred"
      );
    }

    // Handle request error by passing the Error object
    return Promise.reject(error); // Rejection is now always an instance of Error
  }
);
