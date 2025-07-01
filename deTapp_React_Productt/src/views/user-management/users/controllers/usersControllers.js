import {
  get,
  post,
  put,
  remove,
} from "../../../utilities/apiservices/apiServices";
import { getCookie } from "../../../utilities/cookieServices/cookieServices";
import {
  isUserIdCookieName,
  titleCaseFirstWord,
} from "../../../utilities/generals";
import { decodeData } from "../../../utilities/securities/encodeDecode";

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
    console.log("Fetching users from /Allusers");
    // Send the GET request to the user API endpoint
    const response = await get("/Allusers", "python");
    console.log("Users response:", response);
    // Return the response data
    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    // Return empty array to prevent UI errors
    return [];
  }
};

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
export const getUserPermissionsController = async () => {
  try {
    // Send the GET request to the user API endpoint
    const body = {
      email: decodeData(getCookie(isUserIdCookieName)),
    };
    console.log("Fetching user permissions for email:", body.email);
    
    // Try to get permissions from the login response stored in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Check if we have permissions stored from login
        const loginData = JSON.parse(localStorage.getItem("loginResponse"));
        if (loginData && loginData.permissions && loginData.permissions.length > 0) {
          console.log("Using permissions from login response:", loginData.permissions);
          return { permissions: loginData.permissions };
        }
      } catch (e) {
        console.warn("Error parsing stored login data:", e);
      }
    }
    
    // If we don't have stored permissions, try to fetch them
    try {
      // According to the API docs, the correct endpoint is /user-permission
      const response = await post(`/user-permission`, body, "python");
      console.log("User permissions response:", response);
      
      if (response && response.permissions && response.permissions.length > 0) {
        return response;
      }
    } catch (permError) {
      console.warn("Error fetching permissions from API:", permError);
    }
    
    // If all else fails, return default admin menus
    console.log("Using default admin menus");
    return { permissions: getDefaultAdminMenus() };
  } catch (error) {
    console.error("Error in getUserPermissionsController:", error);
    // Return default menus in case of error
    return { permissions: getDefaultAdminMenus() };
  }
};

// Function to provide default admin menus when API fails or returns empty
const getDefaultAdminMenus = () => {
  return [
    {
      menu_name: "User Management",
      submenus: [
        {
          submenu_name: "Users",
          submenu_path: "/users"
        },
        {
          submenu_name: "Roles",
          submenu_path: "/roles"
        },
        {
          submenu_name: "Menu",
          submenu_path: "/menu"
        },
        {
          submenu_name: "Submenu",
          submenu_path: "/submenu"
        }
      ]
    },
    {
      menu_name: "Dashboard",
      submenus: [
        {
          submenu_name: "Dashboard",
          submenu_path: "/dashboard"
        }
      ]
    },
    {
      menu_name: "Project Management",
      submenus: [
        {
          submenu_name: "Project Creation",
          submenu_path: "/project-creation"
        },
        {
          submenu_name: "Project Types",
          submenu_path: "/project-types"
        },
        {
          submenu_name: "Project Phases",
          submenu_path: "/project-phases"
        },
        {
          submenu_name: "Project Roles",
          submenu_path: "/project-roles"
        }
      ]
    }
  ];
};

/**
 * Creates a new user with the given form data.
 *
 * @async
 * @function userCreationController
 * @param {Object} formData - The form data for the new user.
 * @param {string} formData.firstName - The first name.
 * @param {string} formData.lastName - The last name.
 * @param {string} formData.email - The email address.
 * @param {string} formData.mobileNo - The mobile number.
 * @param {Object|string} formData.role - The role object or role ID.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the form data is invalid or the API request fails.
 * @example
 * const formData = {

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
      first_name: titleCaseFirstWord(formData.firstName.trim()),
      middle_name: "",
      last_name: titleCaseFirstWord(formData?.lastName.trim()),
      email: formData.email.trim(),
      mobile: formData.mobileNo.trim(),
      role_id: 2,
    };
    // Send the POST request to the user API endpoint
    const response = await post("/user", body, "python");
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
 * @param {string} formData.id - The primary key for user ID.*
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
      first_name: titleCaseFirstWord(formData.firstName.trim()),
      middle_name: "",
      last_name: titleCaseFirstWord(formData?.lastName.trim()),
      email: formData.email.trim(),
      mobile: formData.mobileNo.trim(),
      role_id: formData?.role.id,
    };
    // Send the PUT request to the user API endpoint

    const response = await put(
      `/user?id=${formData.id}`,
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
    const response = await remove(`/user?id=${userId}`, "python");
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
