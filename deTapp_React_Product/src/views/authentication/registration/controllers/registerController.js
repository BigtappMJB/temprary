import { post } from "../../../utilities/apiservices/apiServices";
import { titleCaseFirstWord } from "../../../utilities/generals";

/**
 * Handles the user registration process by sending a POST request
 * to the registration endpoint with the provided form data.
 *
 * @param {Object} formData - The form data containing user information.
 * @param {string} formData.firstname - The user's first name.
 * @param {string} formData.lastname - The user's last name.
 * @param {string} formData.email - The user's email address.
 * @param {string} formData.mobileno - The user's mobile number.
 * @returns {Promise<Object>} The response data from the registration API.
 * @throws {Error} If the registration fails.
 */
export const registerController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    // Destructure and sanitize form data
    const { firstname, lastname, email, mobileno } = formData;

    const sanitizedData = {
      first_name: titleCaseFirstWord(firstname.trim()),
      last_name: titleCaseFirstWord(lastname.trim()),
      email: email.trim(),
      mobile: mobileno.trim(),
    };
    // Send the POST request to the user API endpoint
    const response = await post(
      "/register/registration",
      sanitizedData,
      "python"
    );

    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
