// import {
//   get,
//   post,
//   put,
//   remove,
// } from "../../../utilities/apiservices/apiServices";
// import { titleCaseFirstWord } from "../../../utilities/generals";

// /**
//  * Fetches the list of userRoles from the API.
//  *
//  * @async
//  * @function getuserRolesController
//  * @returns {Promise<Object>} - The response data from the API.
//  * @throws {Error} - If the API request fails.
//  * @example
//  * getuserRolesController()
//  *   .then(response => console.log(response))
//  *   .catch(error => console.error(error));
//  */
// export const getUserRolesController = async () => {
//   try {
//     // Send the GET request to the userRole API endpoint
//     const response = await get("/master/userRole", "python");
//     // Return the response data
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// /**
//  * Creates a new userRole with the given form data.
//  *
//  * @async
//  * @function userRoleCreationController
//  * @param {Object} formData - The form data for the new userRole.
//  * @param {string} formData.name - The userRole name.
//  * @param {string} formData.description - The userRole description.
//  * @returns {Promise<Object>} - The response data from the API.
//  * @throws {Error} - If the form data is invalid or the API request fails.
//  * @example
//  * const formData = {
//  *   name: "tester",
//  *   description: "no description"
//  * };
//  * userRoleCreationController(formData)
//  *   .then(response => console.log(response))
//  *   .catch(error => console.error(error));
//  */
// export const userRoleCreationController = async (formData) => {
//   try {
//     // Data Validation and Sanitization
//     if (!formData || typeof formData !== "object") {
//       throw new Error("Invalid form data");
//     }
//     console.log({ formData });

//     // Prepare the body object with sanitized data
//     const body = {
//       name: titleCaseFirstWord(formData.name.trim()),
//       description: titleCaseFirstWord(formData.description.trim()),
//     };
//     // Send the POST request to the userRole API endpoint
//     const response = await post("/master/userRole", body, "python");
//     // Return the response data
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// /**
//  * Updates an existing userRole with the given form data.
//  *
//  * @async
//  * @function userRoleupdateController
//  * @param {Object} formData - The form data for updating the userRole.
//  * @param {string} formData.name - The userRole name.
//  * @param {string} formData.description - The userRole description.
//  * @param {string} formData.ID - The primary key for userRole ID.
//  * @returns {Promise<Object>} - The response data from the API.
//  * @throws {Error} - If the form data is invalid or the API request fails.
//  * @example
//  * const formData = {
//  *   name: "tester",
//  *   description: "no description",
//  *   ID: 123
//  * };
//  * userRoleupdateController(formData)
//  *   .then(response => console.log(response))
//  *   .catch(error => console.error(error));
//  */
// export const userRoleUpdateController = async (formData) => {
//   try {
//     // Data Validation and Sanitization
//     if (!formData || typeof formData !== "object") {
//       throw new Error("Invalid form data");
//     }
//     console.log({ formData });

//     // Prepare the body object with sanitized data
//     const body = {
//       name: titleCaseFirstWord(formData.name.trim()),
//       description: titleCaseFirstWord(formData.description.trim()),
//     };
//     // Send the PUT request to the userRole API endpoint
//     const response = await put(
//       `/master/userRole?id=${formData.ID}`,
//       body,
//       "python"
//     );
//     // Return the response data
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// /**
//  * Deletes a userRole with the given ID.
//  *
//  * @async
//  * @function userRoleDeleteController
//  * @param {number} userRoleId - The ID of the userRole to delete.
//  * @returns {Promise<Object>} - The response data from the API.
//  * @throws {Error} - If the userRole ID is invalid or the API request fails.
//  * @example
//  * userRoledeleteController(123)
//  *   .then(response => console.log(response))
//  *   .catch(error => console.error(error));
//  */
// export const userRoleDeleteController = async (userRoleId) => {
//   try {
//     // Data Validation and Sanitization
//     if (typeof userRoleId !== "number") {
//       throw new Error("Invalid userRole ID");
//     }
//     // Send the DELETE request to the userRole API endpoint
//     const response = await remove(
//       `/master/userRole?id=${userRoleId}`,
//       "python"
//     );
//     // Return the response data
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };
