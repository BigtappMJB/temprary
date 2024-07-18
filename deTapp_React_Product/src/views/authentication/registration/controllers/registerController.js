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
 * @param {string} formData.password - The user's password.
 * @returns {Promise<Object>} The response data from the registration API.
 * @throws {Error} If the registration fails.
 */
export const registerController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    // Function to remove all spaces from a string
    function removeSpaces(str) {
      return str.replace(/\s+/g, "");
    }

    // Generating a random 4-digit number
    function generateRandom4DigitNumber() {
      return Math.floor(1000 + Math.random() * 9000);
    }

    let random4DigitNumber = generateRandom4DigitNumber();

    // Destructure and sanitize form data
    const { firstname, lastname, email, mobileno, password } = formData;
    let trimmedVariable = removeSpaces(firstname);
    const sanitizedData = {
      userId: trimmedVariable + "-" + random4DigitNumber,
      firstName: titleCaseFirstWord(firstname.trim()),
      lastName: titleCaseFirstWord(lastname.trim()),
      email: email.trim(),
      mobile: mobileno.trim(),
      password: password?.trim(),
      role: 1, // Hardcode value Role is 1
    };
    console.log({ sanitizedData });
    // Send the POST request to the user API endpoint
    const response = await post("/master/user", sanitizedData, "python");

    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
