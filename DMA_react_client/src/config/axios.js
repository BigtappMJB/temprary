/**
 * Creates an instance of Axios with default headers and security configurations.
 *
 * This instance is pre-configured with a base URL from the environment variable `REACT_APP_API_URL`.
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
const instance = axios.create({
  /**
   * Base URL for the API requests.
   * This value is taken from the environment variable `REACT_APP_API_URL`.
   */
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    /**
     * Content-Type header set to application/json.
     */
    "Content-Type": "application/json",
    // Add other headers as needed
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    /**
     * Add security headers to the request config.
     */
    config.headers["Content-Security-Policy"] = "default-src 'elf'"; // Content Security Policy header
    config.headers["X-Content-Type-Options"] = "nosniff"; // X-Content-Type-Options header
    config.headers["X-Frame-Options"] = "SAMEORIGIN"; // X-Frame-Options header
    config.headers["X-XSS-Protection"] = "1; mode=block"; // X-XSS-Protection header
    config.headers["Strict-Transport-Security"] =
      "max-age=31536000; includeSubDomains"; // Strict-Transport-Security header
    config.headers["Referrer-Policy"] = "same-origin"; // Referrer-Policy header
    config.headers["Feature-Policy"] =
      "geolocation 'elf'; microphone 'none'; camera 'none'"; // Feature-Policy header
    config.headers["Cache-Control"] = "no-store"; // Cache-Control header

    // Return the modified request config
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default instance;
